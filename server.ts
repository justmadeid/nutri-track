import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

// Enable large payloads for image transfers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Initialize Gemini Client safely
let aiClient: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  aiClient = new GoogleGenAI({
    apiKey: API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  console.log('Gemini API initialized successfully.');
} else {
  console.warn('GEMINI_API_KEY is not configured or using default token. Running in developer demo mode with detailed smart-simulations if needed.');
}

// ----------------------
// API ENDPOINTS
// ----------------------

// Check API status & check if API key is active
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!API_KEY && API_KEY !== 'MY_GEMINI_API_KEY',
  });
});

// Nutri Guard AI Image Scan Endpoint
app.post('/api/scan', async (req, res) => {
  try {
    const { image, diagnosis } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Data gambar wajib disertakan.' });
    }

    const targetDiagnosis = diagnosis || 'Diabetes';

    // Parse base64 header if present
    let base64Data = image;
    let mimeType = 'image/jpeg';
    
    if (image.startsWith('data:')) {
      const match = image.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        mimeType = match[1];
        base64Data = match[2];
      }
    }

    // System prompt from PRD:
    const systemPrompt = `Anda adalah sistem AI pendamping gizi bernama Nutri Track. Tugas Anda adalah menganalisis foto makanan (khususnya makanan lokal Indonesia) dan mengevaluasi risikonya berdasarkan profil kesehatan pengguna saat ini. 

Aturan Evaluasi:
1. Identifikasi nama makanan dan bahan utama.
2. Analisis risiko bahan terhadap [Diagnosis Pengguna]. Saat ini diagnosis pengguna adalah: ${targetDiagnosis}.
3. Tentukan 'risk_status' HANYA dengan nilai: 'Aman', 'Hati-hati', atau 'Berisiko Tinggi'.
4. Berikan penjelasan logis dalam satu kalimat (XAI).
5. Berikan satu saran alternatif makanan lokal.
6. Estimasikan kadar makronutrisi harian per porsi standar sediaan warung makan/wartek: kalori (kkal), karbohidrat (gram), protein (gram), dan lemak (gram).

Format Output JSON (Wajib) sesuai skema yang disediakan.`;

    if (aiClient) {
      console.log(`Analyzing food photo for diagnosis: ${targetDiagnosis} using Gemini 3.5 Flash...`);
      
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Data,
            },
          },
          'Isilah data evaluasi gizi untuk makanan yang ada pada foto ini dengan relevansi terhadap diagnosis medis: ' + targetDiagnosis,
        ],
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              food_name: {
                type: Type.STRING,
                description: 'Nama hidangan kuliner Indonesia yang terdeteksi, misalnya "Nasi Padang Lauk Rendang", "Soto Babat", "Gado-Gado"'
              },
              detected_ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: 'Daftar bahan-bahan utama yang terlihat atau terkandung dalam hidangan ini'
              },
              risk_status: {
                type: Type.STRING,
                description: 'Risiko makanan ini terhadap diagnosis: Aman, Hati-hati, atau Berisiko Tinggi'
              },
              risk_score: {
                type: Type.INTEGER,
                description: 'Skor tingkat keparahan risiko dari 0 (Sangat Aman) hingga 100 (Sangat Berbahaya)'
              },
              xai_explanation: {
                type: Type.STRING,
                description: 'Satu kalimat penjelasan ilmiah/logis yang mudah dipahami tentang mengapa risiko ini terpilih'
              },
              alternative_suggestion: {
                type: Type.STRING,
                description: 'Rekomendasi satu menu lokal alternatif yang lebih cocok untuk kondisi diagnosis'
              },
              calories_est: {
                type: Type.INTEGER,
                description: 'Estimasi kalori hidangan ini dalam kkal (kilo kalori), misal: 450'
              },
              carbs_est: {
                type: Type.INTEGER,
                description: 'Estimasi karbohidrat hidangan ini dalam gram, misal: 45'
              },
              protein_est: {
                type: Type.INTEGER,
                description: 'Estimasi protein hidangan ini dalam gram, misal: 15'
              },
              fat_est: {
                type: Type.INTEGER,
                description: 'Estimasi lemak hidangan ini dalam gram, misal: 22'
              }
            },
            required: [
              'food_name',
              'detected_ingredients',
              'risk_status',
              'risk_score',
              'xai_explanation',
              'alternative_suggestion',
              'calories_est',
              'carbs_est',
              'protein_est',
              'fat_est'
            ]
          }
        }
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Gemini tidak memberikan jawaban analisis.');
      }

      console.log('Gemini raw response:', responseText);
      const parsedData = JSON.parse(responseText.trim());
      
      // Ensure risk_status is strict
      let status = parsedData.risk_status;
      if (!['Aman', 'Hati-hati', 'Berisiko Tinggi'].includes(status)) {
        if (parsedData.risk_score > 70) status = 'Berisiko Tinggi';
        else if (parsedData.risk_score > 30) status = 'Hati-hati';
        else status = 'Aman';
      }
      parsedData.risk_status = status;

      return res.json(parsedData);
    } else {
      // Graceful local fallback simulation when API key is missing
      console.log(`Running simulation analyzer for client - Diagnosis: ${targetDiagnosis}`);
      
      // We simulate an response according to some common patterns or default
      const simulatedResponses: Record<string, Array<any>> = {
        'Diabetes': [
          {
            food_name: 'Es Teler & Pisang Goreng',
            detected_ingredients: ['Santan', 'Sirup gula merah', 'Nangka', 'Alpukat', 'Tepung terigu', 'Pisang'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 92,
            xai_explanation: 'Kandungan gula sederhana yang sangat tinggi dari sirup dan karbohidrat olahan tepung gorengan dapat memicu lonjakan glukosa darah dengan cepat.',
            alternative_suggestion: 'Es Kelapa Muda tanpa pemanis tambahan atau Jus Alpukat murni dengan sedikit stevia.',
            calories_est: 650,
            carbs_est: 95,
            protein_est: 6,
            fat_est: 28
          },
          {
            food_name: 'Gado-Gado Warteg',
            detected_ingredients: ['Kacang tanah', 'Kol', 'Toge', 'Tahu', 'Tempe', 'Telur rebus'],
            risk_status: 'Hati-hati',
            risk_score: 45,
            xai_explanation: 'Bumbu kacang sering kali mengandung tambahan gula merah dalam jumlah signifikan yang perlu dibatasi porsinya bagi diabetesi.',
            alternative_suggestion: 'Gado-gado dengan bumbu kacang yang dipisah atau dikurangi porsinya.',
            calories_est: 380,
            carbs_est: 32,
            protein_est: 14,
            fat_est: 22
          },
          {
            food_name: 'Soto Ayam Bening',
            detected_ingredients: ['Daging ayam', 'Kuah kaldu soto', 'Soun', 'Kubis', 'Toge', 'Daun bawang'],
            risk_status: 'Aman',
            risk_score: 15,
            xai_explanation: 'Makanan ini rendah indeks glikemik dan kaya protein, asalkan konsumsi soun dan nasi putih dibatasi porsinya.',
            alternative_suggestion: 'Tambah ekstra seledri dan telur rebus serta kurangi soun/nasi.',
            calories_est: 220,
            carbs_est: 18,
            protein_est: 21,
            fat_est: 7
          }
        ],
        'Kolesterol': [
          {
            food_name: 'Gulai Tunjang Padang (Urat Bovine)',
            detected_ingredients: ['Kikil/Urat', 'Santan kelapa kental', 'Minyak kelapa', 'Bumbu gulai'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 88,
            xai_explanation: 'Lemak jenuh yang melimpah dari santan kental berulang kali masak serta kolesterol tinggi dari kikil dapat memperburuk kadar LDL darah.',
            alternative_suggestion: 'Soto Kudus bening atau Ikan Kembung Bakar tanpa santan.',
            calories_est: 512,
            carbs_est: 12,
            protein_est: 24,
            fat_est: 42
          },
          {
            food_name: 'Ayam Goreng Lengkuas',
            detected_ingredients: ['Ayam', 'Minyak goreng kelapa', 'Rempah lengkuas parut'],
            risk_status: 'Hati-hati',
            risk_score: 55,
            xai_explanation: 'Ayam goreng mengandung kolesterol jenuh akibat proses penggorengan dalam minyak panas (deep-fry).',
            alternative_suggestion: 'Ayam pop tanpa kulit atau Ayam panggang bumbu rujak.',
            calories_est: 340,
            carbs_est: 4,
            protein_est: 26,
            fat_est: 25
          },
          {
            food_name: 'Sayur Asem & Tahu Bacem',
            detected_ingredients: ['Melinjo', 'Kacang panjang', 'Labu siam', 'Jagung', 'Tahu', 'Bumbu asem'],
            risk_status: 'Aman',
            risk_score: 20,
            xai_explanation: 'Kaya akan serat larut air dari buah-buahan lokal dan tahu kukus yang efektif membantu mengikat asam empedu dan sisa kolesterol harian.',
            alternative_suggestion: 'Sajikan dengan sambal terasi segar porsi sedang.',
            calories_est: 185,
            carbs_est: 28,
            protein_est: 9,
            fat_est: 4
          }
        ],
        'Asam Urat': [
          {
            food_name: 'Tumis Daun Melinjo & Kulit Melinjo',
            detected_ingredients: ['Daun melinjo', 'Kulit melinjo', 'Teri nasi', 'Minyak kelapa'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 95,
            xai_explanation: 'Melinjo (daun, kulit, dan biji) serta ikan teri kering adalah sumber purin sangat tinggi yang memicu penumpukan kristal asam urat di sendi.',
            alternative_suggestion: 'Tumis Kangkung bawang putih atau Cah Sawi Hijau.',
            calories_est: 240,
            carbs_est: 15,
            protein_est: 8,
            fat_est: 16
          },
          {
            food_name: 'Soto Babat & Paru Sapi',
            detected_ingredients: ['Jeroan babat', 'Paru sapi', 'Kuah santan soto', 'Bawang goreng'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 90,
            xai_explanation: 'Jeroan seperti babat dan paru mengandung kadar purin ekstrem yang berisiko langsung mencetuskan nyeri sendi gout akut.',
            alternative_suggestion: 'Tahu dan Tempe bacem kukus beserta sayur bening bayam.',
            calories_est: 410,
            carbs_est: 8,
            protein_est: 28,
            fat_est: 30
          },
          {
            food_name: 'Sayur Sop Wortel Kentang',
            detected_ingredients: ['Wortel', 'Kentang', 'Buncis', 'Kubis', 'Kaldu ayam encer'],
            risk_status: 'Aman',
            risk_score: 10,
            xai_explanation: 'Bahan sayuran umbi dan kuah bening ini sangat rendah purin serta membantu hidrasi tubuh untuk mempermudah eliminasi asam urat lewat urin.',
            alternative_suggestion: 'Pepes ikan mas atau telur dadar minim minyak.',
            calories_est: 110,
            carbs_est: 22,
            protein_est: 3,
            fat_est: 1
          }
        ],
        'Obesitas': [
          {
            food_name: 'Nasi Rendang Padang Lengkap',
            detected_ingredients: ['Nasi putih porsi besar', 'Rendang daging sapi santan kental', 'Sayur nangka gulai', 'Sambal ijo minyak'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 85,
            xai_explanation: 'Total energi per porsi bisa melebihi 800 kkal akibat dominansi lemak jenuh dari gulai santan serta karbohidrat tinggi dari nasi putih berlebih.',
            alternative_suggestion: 'Nasi merah setengah porsi dengan lauk Dada Ayam Panggang atau Ikan Bakar tanpa siraman kuah gulai/bumbu minyak.',
            calories_est: 820,
            carbs_est: 95,
            protein_est: 32,
            fat_est: 36
          },
          {
            food_name: 'Martabak Manis Cokelat Keju',
            detected_ingredients: ['Tepung terigu', 'Margarin kelapa', 'Susu kental manis', 'Cokelat meses', 'Keju cheddar'],
            risk_status: 'Berisiko Tinggi',
            risk_score: 98,
            xai_explanation: 'Kombinasi kalori ekstrem berupa lemak trans margarin bersanding dengan gula halus berlimpah mempermudah akumulasi cadangan lemak tubuh.',
            alternative_suggestion: 'Buah pepaya potong segar atau pisang rebus.',
            calories_est: 960,
            carbs_est: 135,
            protein_est: 14,
            fat_est: 40
          },
          {
            food_name: 'Capcay Kuah Warteg',
            detected_ingredients: ['Kembang kol', 'Sawi putih', 'Wortel', 'Bakso sapi iris', 'Bawang putih kaldu'],
            risk_status: 'Aman',
            risk_score: 22,
            xai_explanation: 'Kering dan berserat tinggi, memiliki densitas kalori rendah sehingga memberikan rasa kenyang lebih lama tanpa melonjakkan asupan energi harian.',
            alternative_suggestion: 'Minta porsi sayur diperbanyak dan kurangi porsi nasi pendamping.',
            calories_est: 190,
            carbs_est: 14,
            protein_est: 11,
            fat_est: 10
          }
        ]
      };

      const options = simulatedResponses[targetDiagnosis] || simulatedResponses['Diabetes'];
      // Just pick a random item from options or cycle based on timestamp
      const index = Math.floor(Math.random() * options.length);
      const chosen = options[index];
      
      // Artificial delay for loading experience
      await new Promise(resolve => setTimeout(resolve, 1500));
      return res.json(chosen);
    }
  } catch (err: any) {
    console.error('Scan error:', err);
    res.status(500).json({ error: 'Terjadi kegagalan saat menganalisis makanan: ' + err.message });
  }
});

// ----------------------
// VITE CLIENT DEV SERVER OR STATIC ASSETS ROUTING
// ----------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite development middleware integrated.');
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production static assets from dist/.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Express application active on http://0.0.0.0:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to launch application server:', err);
});

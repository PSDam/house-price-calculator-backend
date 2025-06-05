const express = require('express');
const { scrapePrices } = require('./scraper');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Enable CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/prices', async (req, res) => {
  try {
    const prices = await scrapePrices();
    res.json(prices);
  } catch (error) {
    res.status(500).json({ error: 'Failed to scrape prices' });
  }
});

// Comment out PDF generation endpoint for now
/*
app.post('/generate-pdf', (req, res) => {
  const { costFundatie, costCaramizi, costIzolatie, costTigla, costRigips, costTencuiala, costTotal } = req.body;

  const latexContent = `
\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{geometry}
\\geometry{a4paper, margin=1in}
\\usepackage{booktabs}
\\usepackage{xcolor}
\\usepackage{colortbl}

\\title{Estimare Cost Materiale Casă}
\\date{${new Date().toLocaleDateString('ro-RO')}}
\\author{}

\\begin{document}

\\maketitle

\\section*{Rezumat Costuri}
\\begin{table}[h!]
  \\centering
  \\begin{tabular}{|l|r|}
    \\hline
    \\rowcolor{gray!20} \\textbf{Categorie} & \\textbf{Cost (RON)} \\\\
    \\hline
    Fundație & ${costFundatie.toFixed(2)} \\\\
    \\hline
    Cărămidă & ${costCaramizi.toFixed(2)} \\\\
    \\hline
    Izolație & ${costIzolatie.toFixed(2)} \\\\
    \\hline
    Țiglă & ${costTigla.toFixed(2)} \\\\
    \\hline
    Rigips & ${costRigips.toFixed(2)} \\\\
    \\hline
    Tencuială & ${costTencuiala.toFixed(2)} \\\\
    \\hline
    \\rowcolor{gray!20} \\textbf{Total} & \\textbf{${costTotal.toFixed(2)}} \\\\
    \\hline
  \\end{tabular}
  \\caption{Estimare cost materiale pentru construcția casei.}
  \\label{tab:costuri}
\\end{table}

\\end{document}
  `;

  const fileName = `cost-estimate-${Date.now()}`;
  const texFilePath = path.join(__dirname, `${fileName}.tex`);
  const pdfFilePath = path.join(__dirname, `${fileName}.pdf`);

  fs.writeFileSync(texFilePath, latexContent);

  exec(`latexmk -pdf ${texFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error compiling LaTeX:', stderr);
      return res.status(500).json({ error: 'Failed to generate PDF' });
    }

    res.download(pdfFilePath, 'Estimare-Cost-Materiale.pdf', (err) => {
      if (err) {
        console.error('Error sending PDF:', err);
        res.status(500).json({ error: 'Failed to download PDF' });
      }

      fs.unlinkSync(texFilePath);
      fs.unlinkSync(pdfFilePath);
      ['aux', 'log', 'fls', 'fdb_latexmk'].forEach(ext => {
        const auxFile = path.join(__dirname, `${fileName}.${ext}`);
        if (fs.existsSync(auxFile)) fs.unlinkSync(auxFile);
      });
    });
  });
});
*/

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
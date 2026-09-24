// Fixture enregistrée le 2026-09-24
// URL : https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=10.1056/NEJMoa1504720&format=json&tool=ebm-msp&email=ebmmsp@gmail.com
// idconv PMC : DOI EMPA-REG OUTCOME (Zinman 2015), absent de PMC
export default {
  "url": "https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=10.1056/NEJMoa1504720&format=json&tool=ebm-msp&email=ebmmsp@gmail.com",
  "date": "2026-09-24",
  "body": {
    "status": "ok",
    "response-date": "2026-09-24 06:51:02",
    "request": {
      "warnings": [],
      "format": "json",
      "ids": [
        "10.1056/NEJMoa1504720"
      ],
      "email": "ebmmsp@gmail.com",
      "tool": "ebm-msp",
      "echo": "ids=10.1056%2FNEJMoa1504720&format=json&tool=ebm-msp&email=ebmmsp%40gmail.com",
      "versions": "no",
      "showaiid": "no",
      "idtype": "doi"
    },
    "records": [
      {
        "doi": "10.1056/NEJMoa1504720",
        "requested-id": "10.1056/NEJMoa1504720",
        "status": "error",
        "errmsg": "Identifier not found in PMC"
      }
    ]
  }
};

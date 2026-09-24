// Fixture enregistrée le 2026-09-24
// URL : https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:32678530%20AND%20SRC:MED&format=json&resultType=core
// investigatorList tronquée (323283 car. dans la réponse réelle) ; authorList tronquée (58479 car. dans la réponse réelle) ; reste = réponse réelle Europe PMC, inchangée
export default {
  "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:32678530%20AND%20SRC:MED&format=json&resultType=core",
  "date": "2026-09-24",
  "body": {
    "version": "6.9",
    "hitCount": 1,
    "request": {
      "queryString": "EXT_ID:32678530 AND SRC:MED",
      "internalQuery": "EXT_ID:32678530 AND SRC:MED",
      "resultType": "CORE",
      "cursorMark": "*",
      "pageSize": 25,
      "sort": "",
      "synonym": false
    },
    "resultList": {
      "result": [
        {
          "id": "32678530",
          "source": "MED",
          "pmid": "32678530",
          "pmcid": "PMC7383595",
          "fullTextIdList": {
            "fullTextId": [
              "PMC7383595"
            ]
          },
          "doi": "10.1056/nejmoa2021436",
          "title": "Dexamethasone in Hospitalized Patients with Covid-19.",
          "authorString": "RECOVERY Collaborative Group, Horby P, Lim WS, Emberson JR, Mafham M, Bell JL, Linsell L, Staplin N, Brightling C, Ustianowski A, Elmahi E, Prudon B, Green C, Felton T, Chadwick D, Rege K, Fegan C, Chappell LC, Faust SN, Jaki T, Jeffery K, Montgomery A, Rowan K, Juszczak E, Baillie JK, Haynes R, Landray MJ.",
          "authorList": "[TRONQUÉ par la session P16/S5 : liste d'auteurs complète, 58479 car., sans rapport avec identite.mjs]",
          "investigatorList": "[TRONQUÉ par la session P16/S5 : liste des ? investigateurs de l'essai, 323283 car., sans rapport avec identite.mjs]",
          "authorIdList": {
            "authorId": [
              {
                "type": "ORCID",
                "value": "0000-0001-5042-1880"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5074-0769"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5215-2899"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5258-793X"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5500-2247"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5510-7639"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5743-3104"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-5836-1958"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6050-4663"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6219-3379"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6409-5238"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6646-827X"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6719-0417"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6771-9659"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-6868-6633"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7048-7158"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7302-9793"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7386-7754"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7656-9453"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7792-9422"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7965-4637"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-8217-5602"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-8451-4102"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-8663-2401"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9010-2905"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9098-8590"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9140-4278"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9221-7618"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0333-3738"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0463-3185"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0475-0744"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0583-8019"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0588-3389"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0906-7071"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0930-8330"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1096-188X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1116-628X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1179-0023"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1235-8312"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1238-6524"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1375-0965"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1397-4272"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1696-0757"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-1984-4014"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2119-951X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2271-6988"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2357-7190"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2473-8873"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2506-927X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3101-3512"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3110-8888"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3849-614X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3930-5341"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4278-9316"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4502-2209"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4561-0844"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4608-2756"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4811-4774"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4853-9377"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5108-4158"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5132-3972"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5150-2970"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5482-5660"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5483-9608"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5742-6171"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5828-3328"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5903-3005"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5903-3881"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6012-2574"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6128-8349"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6134-7855"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6350-6557"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6438-7422"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6506-2689"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6811-1124"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7112-3548"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7606-0056"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7694-3051"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7709-6595"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7826-9101"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7944-8793"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7960-8822"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-7992-6038"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8088-1068"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8120-6507"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8167-4466"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8230-175X"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8278-9513"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8566-0344"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8785-0715"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9052-4638"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9169-5607"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9193-2609"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9345-4903"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9447-4252"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9721-6734"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9822-1586"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9871-3070"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9941-6975"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9977-6348"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0450-1606"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0468-4326"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0699-6411"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0772-7475"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0801-6974"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0803-5091"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0995-0072"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1133-8800"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1135-6232"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1206-5584"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1546-7853"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1561-5553"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1697-403X"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1828-0058"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2068-0560"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2328-3755"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2464-3871"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2480-8840"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2564-2555"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2955-4907"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3012-7507"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3188-9140"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3205-6511"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3215-9625"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3309-0164"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3324-969X"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3410-7642"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3635-6212"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3653-4808"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3812-7026"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3906-1997"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-3915-7243"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4061-7569"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4573-449X"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4730-1479"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4764-229X"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4805-5759"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4819-3756"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4999-5144"
              },
              {
                "type": "ORCID",
                "value": "0009-0002-2584-6013"
              },
              {
                "type": "ORCID",
                "value": "0009-0002-3560-6291"
              },
              {
                "type": "ORCID",
                "value": "0009-0003-7054-9939"
              },
              {
                "type": "ORCID",
                "value": "0009-0004-2971-7053"
              },
              {
                "type": "ORCID",
                "value": "0009-0005-1668-6937"
              },
              {
                "type": "ORCID",
                "value": "0009-0005-1921-8266"
              },
              {
                "type": "ORCID",
                "value": "0009-0005-1991-0017"
              },
              {
                "type": "ORCID",
                "value": "0009-0006-2725-3878"
              },
              {
                "type": "ORCID",
                "value": "0009-0007-7196-0454"
              }
            ]
          },
          "dataLinksTagsList": {
            "dataLinkstag": [
              "altmetrics",
              "supporting_data",
              "recommended_reviews"
            ]
          },
          "journalInfo": {
            "issue": "8",
            "volume": "384",
            "journalIssueId": 3105516,
            "dateOfPublication": "2021 Feb",
            "monthOfPublication": 2,
            "yearOfPublication": 2021,
            "journal": {
              "medlineAbbreviation": "N Engl J Med",
              "title": "The New England journal of medicine",
              "essn": "1533-4406",
              "issn": "0028-4793",
              "nlmid": "0255562",
              "isoabbreviation": "N Engl J Med"
            },
            "printPublicationDate": "2021-02-01"
          },
          "pubYear": "2021",
          "pageInfo": "693-704",
          "abstractText": "<h4>Background</h4>Coronavirus disease 2019 (Covid-19) is associated with diffuse lung damage. Glucocorticoids may modulate inflammation-mediated lung injury and thereby reduce progression to respiratory failure and death.<h4>Methods</h4>In this controlled, open-label trial comparing a range of possible treatments in patients who were hospitalized with Covid-19, we randomly assigned patients to receive oral or intravenous dexamethasone (at a dose of 6 mg once daily) for up to 10 days or to receive usual care alone. The primary outcome was 28-day mortality. Here, we report the final results of this assessment.<h4>Results</h4>A total of 2104 patients were assigned to receive dexamethasone and 4321 to receive usual care. Overall, 482 patients (22.9%) in the dexamethasone group and 1110 patients (25.7%) in the usual care group died within 28 days after randomization (age-adjusted rate ratio, 0.83; 95% confidence interval [CI], 0.75 to 0.93; P<0.001). The proportional and absolute between-group differences in mortality varied considerably according to the level of respiratory support that the patients were receiving at the time of randomization. In the dexamethasone group, the incidence of death was lower than that in the usual care group among patients receiving invasive mechanical ventilation (29.3% vs. 41.4%; rate ratio, 0.64; 95% CI, 0.51 to 0.81) and among those receiving oxygen without invasive mechanical ventilation (23.3% vs. 26.2%; rate ratio, 0.82; 95% CI, 0.72 to 0.94) but not among those who were receiving no respiratory support at randomization (17.8% vs. 14.0%; rate ratio, 1.19; 95% CI, 0.92 to 1.55).<h4>Conclusions</h4>In patients hospitalized with Covid-19, the use of dexamethasone resulted in lower 28-day mortality among those who were receiving either invasive mechanical ventilation or oxygen alone at randomization but not among those receiving no respiratory support. (Funded by the Medical Research Council and National Institute for Health Research and others; RECOVERY ClinicalTrials.gov number, NCT04381936; ISRCTN number, 50189673.).",
          "publicationStatus": "ppublish",
          "language": "eng",
          "pubModel": "Print-Electronic",
          "pubTypeList": {
            "pubType": [
              "Comparative Study",
              "research-article",
              "Multicenter Study",
              "Randomized Controlled Trial",
              "Journal Article"
            ]
          },
          "grantsList": {
            "grant": [
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2016-14-002",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2020-11-003",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_PC_20062",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "NIHR-INF-1074",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "1790394",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "CL-2018-13-007",
                "orderIn": 0
              },
              {
                "agency": "United Kingdom Research and Innovation",
                "grantId": "MC_PC_19056",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_U137686861",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_UU_00017/3",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MR/K025643/1",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MR/S001751/1",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "NIHR201409",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_PC_19056",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "SRF-2015-08-001",
                "orderIn": 0
              },
              {
                "agency": "Biotechnology and Biological Sciences Research Council",
                "acronym": "BB_",
                "grantId": "BBS/E/D/20002174",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "G0701652",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "HDR-9005",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_U137686860",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_UU_12026/4",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "NIHR200268",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "NIHR202424",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "NIHR300669",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "MC_PC_19056",
                "orderIn": 0
              },
              {
                "agency": "Kidney Research UK",
                "grantId": "TF_009_20181123",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "11/46/14",
                "orderIn": 0
              },
              {
                "agency": "Wellcome Trust",
                "acronym": "WT",
                "grantId": "222406/Z/21/Z",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2017-24-501",
                "orderIn": 0
              },
              {
                "agency": "Biotechnology and Biological Sciences Research Council",
                "acronym": "BB_",
                "grantId": "BBS/E/D/30002277",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_PC_20029",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_UU_00002/14",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "acronym": "DH_",
                "grantId": "RP-2014-05-019",
                "orderIn": 0
              },
              {
                "agency": "Cancer Research UK",
                "acronym": "CRUK_",
                "grantId": "25350",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2019-06-012",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2019-13-003",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "ACF-2020-06-012",
                "orderIn": 0
              },
              {
                "agency": "Academy of Medical Sciences",
                "acronym": "AMS_",
                "grantId": "AMS-CSF4-Torok",
                "orderIn": 0
              },
              {
                "agency": "Medical Research Council",
                "acronym": "MRC_",
                "grantId": "MC_PC_18033",
                "orderIn": 0
              },
              {
                "agency": "National Institute for Health Research (NIHR)",
                "grantId": "RP-2016-07-012",
                "orderIn": 0
              },
              {
                "agency": "Wellcome Trust",
                "acronym": "WT_",
                "orderIn": 0
              }
            ]
          },
          "meshHeadingList": {
            "meshHeading": [
              {
                "majorTopic_YN": "N",
                "descriptorName": "Humans"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Dexamethasone",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "AD",
                      "qualifierName": "administration & dosage"
                    },
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "AE",
                      "qualifierName": "adverse effects"
                    },
                    {
                      "majorTopic_YN": "Y",
                      "abbreviation": "TU",
                      "qualifierName": "therapeutic use"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Glucocorticoids",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "AD",
                      "qualifierName": "administration & dosage"
                    },
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "AE",
                      "qualifierName": "adverse effects"
                    },
                    {
                      "majorTopic_YN": "Y",
                      "abbreviation": "TU",
                      "qualifierName": "therapeutic use"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Anti-Infective Agents",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "TU",
                      "qualifierName": "therapeutic use"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Drug Therapy, Combination"
              },
              {
                "majorTopic_YN": "Y",
                "descriptorName": "Respiration, Artificial"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Hospitalization"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Length of Stay"
              },
              {
                "majorTopic_YN": "Y",
                "descriptorName": "Oxygen Inhalation Therapy"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Administration, Oral"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Injections, Intravenous"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Odds Ratio"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Aged"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Aged, 80 and over"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Female"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Male"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Kaplan-Meier Estimate"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "United Kingdom"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "COVID-19",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "MO",
                      "qualifierName": "mortality"
                    },
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "TH",
                      "qualifierName": "therapy"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "Y",
                "descriptorName": "COVID-19 Drug Treatment"
              }
            ]
          },
          "chemicalList": {
            "chemical": [
              {
                "name": "Anti-Infective Agents",
                "registryNumber": "0"
              },
              {
                "name": "Glucocorticoids",
                "registryNumber": "0"
              },
              {
                "name": "Dexamethasone",
                "registryNumber": "7S5I7G3JQL"
              }
            ]
          },
          "subsetList": {
            "subset": [
              {
                "code": "IM",
                "name": "Index Medicus"
              }
            ]
          },
          "fullTextUrlList": {
            "fullTextUrl": [
              {
                "availability": "Subscription required",
                "availabilityCode": "S",
                "documentStyle": "doi",
                "site": "DOI",
                "url": "https://doi.org/10.1056/NEJMoa2021436"
              },
              {
                "availability": "Open access",
                "availabilityCode": "OA",
                "documentStyle": "html",
                "site": "Europe_PMC",
                "url": "https://europepmc.org/articles/PMC7383595"
              },
              {
                "availability": "Open access",
                "availabilityCode": "OA",
                "documentStyle": "pdf",
                "site": "Europe_PMC",
                "url": "https://europepmc.org/articles/PMC7383595?pdf=render"
              }
            ]
          },
          "commentCorrectionList": {
            "commentCorrection": [
              {
                "source": "MED",
                "id": "32678528",
                "reference": "N Engl J Med. 2021 Feb 25;384(8):755-757. doi: 10.1056/NEJMe2024638.",
                "type": "Comment in",
                "orderIn": 1
              },
              {
                "source": "MED",
                "id": "32706531",
                "reference": "N Engl J Med. 2021 Feb 25;384(8):757-758. doi: 10.1056/NEJMe2025674.",
                "type": "Comment in",
                "orderIn": 2
              },
              {
                "source": "MED",
                "id": "32886206",
                "reference": "Intensive Care Med. 2020 Nov;46(11):2108-2110. doi: 10.1007/s00134-020-06230-z.",
                "type": "Comment in",
                "orderIn": 3
              },
              {
                "source": "MED",
                "id": "33045189",
                "reference": "Lancet. 2020 Oct 24;396(10259):e61-e62. doi: 10.1016/S0140-6736(20)32132-2.",
                "type": "Comment in",
                "orderIn": 4
              },
              {
                "source": "MED",
                "id": "33139895",
                "reference": "Nat Rev Clin Oncol. 2021 Jan;18(1):7-8. doi: 10.1038/s41571-020-00448-y.",
                "type": "Comment in",
                "orderIn": 5
              },
              {
                "source": "MED",
                "id": "34865289",
                "reference": "Respirology. 2022 Feb;27(2):107-108. doi: 10.1111/resp.14193.",
                "type": "Comment in",
                "orderIn": 6
              },
              {
                "source": "PPR",
                "id": "PPR179288",
                "type": "Preprint in",
                "note": "CrossRef Pre-print loader",
                "orderIn": 10002
              }
            ]
          },
          "isOpenAccess": "Y",
          "inEPMC": "Y",
          "inPMC": "Y",
          "citedByCount": 8145,
          "hasReferences": "Y",
          "hasTextMinedTerms": "Y",
          "hasDbCrossReferences": "N",
          "hasPDF": "Y",
          "hasBook": "N",
          "hasSuppl": "Y",
          "hasLabsLinks": "Y",
          "hasData": "Y",
          "authMan": "N",
          "epmcAuthMan": "N",
          "nihAuthMan": "N",
          "hasTMAccessionNumbers": "Y",
          "tmAccessionTypeList": {
            "accessionType": [
              "nct"
            ]
          },
          "dateOfCompletion": "2021-03-01",
          "dateOfCreation": "2020-07-18",
          "dateOfRevision": "2025-05-30",
          "electronicPublicationDate": "2020-07-17",
          "firstPublicationDate": "2020-07-17",
          "firstIndexDate": "2020-07-18",
          "fullTextReceivedDate": "2025-02-03",
          "hasEvaluations": "N"
        }
      ]
    }
  }
};

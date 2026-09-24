// Fixture enregistrée le 2026-09-24
// URL : https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1056/NEJMoa1504720&format=json&resultType=core
// investigatorList tronquée (56677 car. dans la réponse réelle) ; reste = réponse réelle Europe PMC, inchangée
export default {
  "url": "https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:10.1056/NEJMoa1504720&format=json&resultType=core",
  "date": "2026-09-24",
  "body": {
    "version": "6.9",
    "hitCount": 1,
    "request": {
      "queryString": "DOI:10.1056/NEJMoa1504720",
      "resultType": "core",
      "cursorMark": "*",
      "pageSize": 25,
      "sort": "",
      "synonym": false
    },
    "resultList": {
      "result": [
        {
          "id": "26378978",
          "source": "MED",
          "pmid": "26378978",
          "doi": "10.1056/nejmoa1504720",
          "title": "Empagliflozin, Cardiovascular Outcomes, and Mortality in Type 2 Diabetes.",
          "authorString": "Zinman B, Wanner C, Lachin JM, Fitchett D, Bluhmki E, Hantel S, Mattheus M, Devins T, Johansen OE, Woerle HJ, Broedl UC, Inzucchi SE, EMPA-REG OUTCOME Investigators.",
          "authorList": {
            "author": [
              {
                "fullName": "Zinman B",
                "lastName": "Zinman",
                "firstName": "Bernard",
                "initials": "B",
                "authorAffiliationDetailsList": {
                  "authorAffiliation": [
                    {
                      "affiliation": "From the Lunenfeld-Tanenbaum Research Institute, Mount Sinai Hospital (B.Z.) and the Divisions of Endocrinology (B.Z.) and Cardiology (D.F.), University of Toronto - all in Toronto; the Department of Medicine, Division of Nephrology, Würzburg University Clinic, Würzburg (C.W.), Boehringer Ingelheim Pharma, Biberach (E.B., S.H.), and Boehringer Ingelheim Pharma, Ingelheim (M.M., H.J.W., U.C.B.) - all in Germany; the Biostatistics Center, George Washington University, Rockville, MD (J.M.L.); Boehringer Ingelheim Pharmaceuticals, Ridgefield, CT (T.D.); Boehringer Ingelheim Norway, Asker, Norway (O.E.J.); and the Section of Endocrinology, Yale University School of Medicine, New Haven, CT (S.E.I.)."
                    }
                  ]
                }
              },
              {
                "fullName": "Wanner C",
                "lastName": "Wanner",
                "firstName": "Christoph",
                "initials": "C"
              },
              {
                "fullName": "Lachin JM",
                "lastName": "Lachin",
                "firstName": "John M",
                "initials": "JM",
                "authorId": {
                  "type": "ORCID",
                  "value": "0000-0001-9838-2841"
                }
              },
              {
                "fullName": "Fitchett D",
                "lastName": "Fitchett",
                "firstName": "David",
                "initials": "D"
              },
              {
                "fullName": "Bluhmki E",
                "lastName": "Bluhmki",
                "firstName": "Erich",
                "initials": "E"
              },
              {
                "fullName": "Hantel S",
                "lastName": "Hantel",
                "firstName": "Stefan",
                "initials": "S"
              },
              {
                "fullName": "Mattheus M",
                "lastName": "Mattheus",
                "firstName": "Michaela",
                "initials": "M"
              },
              {
                "fullName": "Devins T",
                "lastName": "Devins",
                "firstName": "Theresa",
                "initials": "T"
              },
              {
                "fullName": "Johansen OE",
                "lastName": "Johansen",
                "firstName": "Odd Erik",
                "initials": "OE"
              },
              {
                "fullName": "Woerle HJ",
                "lastName": "Woerle",
                "firstName": "Hans J",
                "initials": "HJ"
              },
              {
                "fullName": "Broedl UC",
                "lastName": "Broedl",
                "firstName": "Uli C",
                "initials": "UC"
              },
              {
                "fullName": "Inzucchi SE",
                "lastName": "Inzucchi",
                "firstName": "Silvio E",
                "initials": "SE"
              },
              {
                "collectiveName": "EMPA-REG OUTCOME Investigators"
              }
            ]
          },
          "investigatorList": "[TRONQUÉ par la session P16/S5 : liste des ? investigateurs de l'essai, 56677 car., sans rapport avec identite.mjs]",
          "authorIdList": {
            "authorId": [
              {
                "type": "ORCID",
                "value": "0000-0001-6003-4622"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7065-2045"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7187-2234"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-7187-984X"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9237-8585"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9390-1200"
              },
              {
                "type": "ORCID",
                "value": "0000-0001-9838-2841"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-0316-4700"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2107-6480"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-2128-8029"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3325-0263"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-3820-7897"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4007-9695"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4055-5233"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-4564-4518"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5112-5810"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-5213-7768"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6234-3936"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6593-8417"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6645-2515"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-6691-4871"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8451-8522"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-8671-4527"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9114-5541"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9122-8742"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9152-0583"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9217-2533"
              },
              {
                "type": "ORCID",
                "value": "0000-0002-9724-6933"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-0615-2534"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-1296-0511"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-2407-9860"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4601-6203"
              },
              {
                "type": "ORCID",
                "value": "0000-0003-4677-9526"
              }
            ]
          },
          "dataLinksTagsList": {
            "dataLinkstag": [
              "altmetrics",
              "recommended_reviews",
              "supporting_data"
            ]
          },
          "journalInfo": {
            "issue": "22",
            "volume": "373",
            "journalIssueId": 2345931,
            "dateOfPublication": "2015 Nov",
            "monthOfPublication": 11,
            "yearOfPublication": 2015,
            "journal": {
              "medlineAbbreviation": "N Engl J Med",
              "title": "The New England journal of medicine",
              "essn": "1533-4406",
              "issn": "0028-4793",
              "nlmid": "0255562",
              "isoabbreviation": "N Engl J Med"
            },
            "printPublicationDate": "2015-11-01"
          },
          "pubYear": "2015",
          "pageInfo": "2117-2128",
          "abstractText": "<h4>Background</h4>The effects of empagliflozin, an inhibitor of sodium-glucose cotransporter 2, in addition to standard care, on cardiovascular morbidity and mortality in patients with type 2 diabetes at high cardiovascular risk are not known.<h4>Methods</h4>We randomly assigned patients to receive 10 mg or 25 mg of empagliflozin or placebo once daily. The primary composite outcome was death from cardiovascular causes, nonfatal myocardial infarction, or nonfatal stroke, as analyzed in the pooled empagliflozin group versus the placebo group. The key secondary composite outcome was the primary outcome plus hospitalization for unstable angina.<h4>Results</h4>A total of 7020 patients were treated (median observation time, 3.1 years). The primary outcome occurred in 490 of 4687 patients (10.5%) in the pooled empagliflozin group and in 282 of 2333 patients (12.1%) in the placebo group (hazard ratio in the empagliflozin group, 0.86; 95.02% confidence interval, 0.74 to 0.99; P=0.04 for superiority). There were no significant between-group differences in the rates of myocardial infarction or stroke, but in the empagliflozin group there were significantly lower rates of death from cardiovascular causes (3.7%, vs. 5.9% in the placebo group; 38% relative risk reduction), hospitalization for heart failure (2.7% and 4.1%, respectively; 35% relative risk reduction), and death from any cause (5.7% and 8.3%, respectively; 32% relative risk reduction). There was no significant between-group difference in the key secondary outcome (P=0.08 for superiority). Among patients receiving empagliflozin, there was an increased rate of genital infection but no increase in other adverse events.<h4>Conclusions</h4>Patients with type 2 diabetes at high risk for cardiovascular events who received empagliflozin, as compared with placebo, had a lower rate of the primary composite cardiovascular outcome and of death from any cause when the study drug was added to standard care. (Funded by Boehringer Ingelheim and Eli Lilly; EMPA-REG OUTCOME ClinicalTrials.gov number, NCT01131676.).",
          "affiliation": "From the Lunenfeld-Tanenbaum Research Institute, Mount Sinai Hospital (B.Z.) and the Divisions of Endocrinology (B.Z.) and Cardiology (D.F.), University of Toronto - all in Toronto; the Department of Medicine, Division of Nephrology, Würzburg University Clinic, Würzburg (C.W.), Boehringer Ingelheim Pharma, Biberach (E.B., S.H.), and Boehringer Ingelheim Pharma, Ingelheim (M.M., H.J.W., U.C.B.) - all in Germany; the Biostatistics Center, George Washington University, Rockville, MD (J.M.L.); Boehringer Ingelheim Pharmaceuticals, Ridgefield, CT (T.D.); Boehringer Ingelheim Norway, Asker, Norway (O.E.J.); and the Section of Endocrinology, Yale University School of Medicine, New Haven, CT (S.E.I.).",
          "publicationStatus": "ppublish",
          "language": "eng",
          "pubModel": "Print-Electronic",
          "pubTypeList": {
            "pubType": [
              "Comparative Study",
              "Research Support, Non-U.S. Gov't",
              "Multicenter Study",
              "Randomized Controlled Trial",
              "Journal Article"
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
                "descriptorName": "Cardiovascular Diseases",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "MO",
                      "qualifierName": "mortality"
                    },
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "EP",
                      "qualifierName": "epidemiology"
                    },
                    {
                      "majorTopic_YN": "Y",
                      "abbreviation": "PC",
                      "qualifierName": "prevention & control"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Diabetes Mellitus, Type 2",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "Y",
                      "abbreviation": "DT",
                      "qualifierName": "drug therapy"
                    },
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "MO",
                      "qualifierName": "mortality"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Benzhydryl Compounds",
                "meshQualifierList": {
                  "meshQualifier": [
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
                "descriptorName": "Glucosides",
                "meshQualifierList": {
                  "meshQualifier": [
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
                "descriptorName": "Hypoglycemic Agents",
                "meshQualifierList": {
                  "meshQualifier": [
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
                "descriptorName": "Hospitalization",
                "meshQualifierList": {
                  "meshQualifier": [
                    {
                      "majorTopic_YN": "N",
                      "abbreviation": "SN",
                      "qualifierName": "statistics & numerical data"
                    }
                  ]
                }
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Cause of Death"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Risk Factors"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Aged"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Middle Aged"
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
                "descriptorName": "Intention to Treat Analysis"
              },
              {
                "majorTopic_YN": "N",
                "descriptorName": "Kaplan-Meier Estimate"
              }
            ]
          },
          "chemicalList": {
            "chemical": [
              {
                "name": "Hypoglycemic Agents",
                "registryNumber": "0"
              },
              {
                "name": "Glucosides",
                "registryNumber": "0"
              },
              {
                "name": "Benzhydryl Compounds",
                "registryNumber": "0"
              },
              {
                "name": "empagliflozin",
                "registryNumber": "HDC1R2M35U"
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
                "url": "https://doi.org/10.1056/NEJMoa1504720"
              }
            ]
          },
          "commentCorrectionList": {
            "commentCorrection": [
              {
                "source": "MED",
                "id": "26590679",
                "reference": "Lancet Diabetes Endocrinol. 2015 Dec;3(12):928-9. doi: 10.1016/S2213-8587(15)00424-6",
                "type": "Comment in",
                "orderIn": 1
              },
              {
                "source": "MED",
                "id": "26590680",
                "reference": "Lancet Diabetes Endocrinol. 2015 Dec;3(12):929-30. doi: 10.1016/S2213-8587(15)00426-X",
                "type": "Comment in",
                "orderIn": 2
              },
              {
                "source": "MED",
                "id": "26590681",
                "reference": "Lancet Diabetes Endocrinol. 2015 Dec;3(12):930-1. doi: 10.1016/S2213-8587(15)00427-1",
                "type": "Comment in",
                "orderIn": 3
              },
              {
                "source": "MED",
                "id": "26590682",
                "reference": "Lancet Diabetes Endocrinol. 2015 Dec;3(12):931. doi: 10.1016/S2213-8587(15)00439-8",
                "type": "Comment in",
                "orderIn": 4
              },
              {
                "source": "MED",
                "id": "26605932",
                "reference": "N Engl J Med. 2015 Nov 26;373(22):2178-9. doi: 10.1056/NEJMe1512602",
                "type": "Comment in",
                "orderIn": 5
              },
              {
                "source": "MED",
                "id": "26621824",
                "reference": "Postgrad Med J. 2016 Feb;92(1084):118-9. doi: 10.1136/postgradmedj-2015-133769",
                "type": "Comment in",
                "orderIn": 6
              },
              {
                "source": "MED",
                "id": "26634255",
                "reference": "Internist (Berl). 2016 Jan;57(1):102-3. doi: 10.1007/s00108-015-3848-z",
                "type": "Comment in",
                "orderIn": 7
              },
              {
                "source": "MED",
                "id": "26671327",
                "reference": "Semergen. 2016 Jul-Aug;42(5):e38-9. doi: 10.1016/j.semerg.2015.10.010",
                "type": "Comment in",
                "orderIn": 8
              },
              {
                "source": "MED",
                "id": "26784492",
                "reference": "Ann Intern Med. 2016 Jan 19;164(2):JC2. doi: 10.7326/ACPJC-2016-164-2-002",
                "type": "Comment in",
                "orderIn": 9
              },
              {
                "source": "MED",
                "id": "26981940",
                "reference": "N Engl J Med. 2016 Mar 17;374(11):1094. doi: 10.1056/NEJMc1600827",
                "type": "Comment in",
                "orderIn": 10
              },
              {
                "source": "MED",
                "id": "26981941",
                "reference": "N Engl J Med. 2016 Mar 17;374(11):1092. doi: 10.1056/NEJMc1600827",
                "type": "Comment in",
                "orderIn": 11
              },
              {
                "source": "MED",
                "id": "26981942",
                "reference": "N Engl J Med. 2016 Mar 17;374(11):1092-3. doi: 10.1056/NEJMc1600827",
                "type": "Comment in",
                "orderIn": 12
              },
              {
                "source": "MED",
                "id": "26981943",
                "reference": "N Engl J Med. 2016 Mar 17;374(11):1093. doi: 10.1056/NEJMc1600827",
                "type": "Comment in",
                "orderIn": 13
              },
              {
                "source": "MED",
                "id": "26981944",
                "reference": "N Engl J Med. 2016 Mar 17;374(11):1093-4. doi: 10.1056/NEJMc1600827",
                "type": "Comment in",
                "orderIn": 14
              },
              {
                "source": "MED",
                "id": "26983334",
                "reference": "Med Monatsschr Pharm. 2016 Feb;39(2):63.",
                "type": "Comment in",
                "orderIn": 15
              },
              {
                "source": "MED",
                "id": "27039253",
                "reference": "Am J Kidney Dis. 2016 Sep;68(3):349-52. doi: 10.1053/j.ajkd.2016.03.410",
                "type": "Comment in",
                "orderIn": 16
              },
              {
                "source": "MED",
                "id": "27043258",
                "reference": "Postgrad Med. 2016 May;128(4):335-7. doi: 10.1080/00325481.2016.1174566",
                "type": "Comment in",
                "orderIn": 17
              },
              {
                "source": "MED",
                "id": "27508868",
                "reference": "Cell Metab. 2016 Aug 9;24(2):200-2. doi: 10.1016/j.cmet.2016.07.018",
                "type": "Comment in",
                "orderIn": 18
              },
              {
                "source": "MED",
                "id": "29077267",
                "reference": "Diabetes Obes Metab. 2018 Apr;20(4):763-765. doi: 10.1111/dom.13142",
                "type": "Comment in",
                "orderIn": 19
              }
            ]
          },
          "isOpenAccess": "N",
          "inEPMC": "N",
          "inPMC": "N",
          "citedByCount": 8747,
          "hasReferences": "Y",
          "hasTextMinedTerms": "Y",
          "hasDbCrossReferences": "N",
          "hasPDF": "N",
          "hasBook": "N",
          "hasSuppl": "N",
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
          "dateOfCompletion": "2015-12-04",
          "dateOfCreation": "2015-09-18",
          "dateOfRevision": "2024-12-19",
          "electronicPublicationDate": "2015-09-17",
          "firstPublicationDate": "2015-09-17",
          "firstIndexDate": "2015-09-18",
          "hasEvaluations": "N"
        }
      ]
    }
  }
};

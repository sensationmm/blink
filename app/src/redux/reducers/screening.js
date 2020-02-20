import {
  SET_COUNTRY,
  SET_COMPANY,
  SET_COMPANY_STRUCTURE,
  SET_OWNERSHIP_THRESHOLD,
  SET_COMPLETION,
  SET_ERRORS,
} from '../constants';

export const initialState = {
  company: {
    countryCode: 'GB',
    companyId: '10103078',
    name: 'Eleven FS Group Limited',
    type: 'Private limited with share capital',
    incorporationDate: '2016-04-05',
    officialStatus: 'Active',
    simplifiedStatus: 'Active',
    legalEntityIdentifier: null,
    incorporationCountry: 'United Kingdom',
    numberOfEmployees: 19,
    primaryWebsite: null,
    registeredAddress: {
      fullAddress: '1 Finsbury Avenue, 11:Fs, 2nd Floor, London, EC2M 2PF',
      structuredAddress: {
        premises: '1 Finsbury Avenue, 11',
        thoroughfare: ':Fs',
        dependentLocality: '2nd Floor',
        postTown: 'London',
        county: 'London',
        postcode: 'EC2M 2PF',
        countryCode: 'GB'
      },
      geolocation: {
        latitude: 51.51996,
        longitude: -0.08485
      }
    },
    charitableIdentitiesCount: 0,
    accounts: {
      filingType: 'Total exemption full',
      currency: 'GBP',
      latestAccountsDate: '2018-04-30',
      consolidatedAccounts: false,
      nextAccountsDueDate: '2020-04-09'
    },
    financialSummary: {
      turnover: null,
      ebitda: null,
      postTaxProfit: null,
      totalAssets: 3023608,
      netAssets: 1690396
    },
    pagination: {
      offset: 0,
      limit: 50,
      total: 2
    },
    filters: null,
    industries: [
      {
        name: 'Management consultancy activities (other than financial management)',
        code: '70229',
        type: 'SIC2007'
      },
      {
        name: 'Business and management consultancy activities',
        code: '7414',
        type: 'SIC2003'
      }
    ]
  },
  companyStructure: {
    incorporationCountry: 'United Kingdom',
    registeredAddress: {
      geolocation: {
        latitude: 51.51996,
        longitude: -0.08485
      },
      fullAddress: '1 Finsbury Avenue, 11:Fs, 2nd Floor, London, EC2M 2PF',
      structuredAddress: {
        postcode: 'EC2M 2PF',
        premises: '1 Finsbury Avenue, 11',
        dependentLocality: '2nd Floor',
        countryCode: 'GB',
        county: 'London',
        postTown: 'London',
        thoroughfare: ':Fs'
      }
    },
    officialStatus: 'Active',
    pagination: {
      total: 2,
      offset: 0,
      limit: 50
    },
    accounts: {
      consolidatedAccounts: false,
      currency: 'GBP',
      filingType: 'Total exemption full',
      latestAccountsDate: '2018-04-30',
      nextAccountsDueDate: '2020-04-09'
    },
    numberOfEmployees: 19,
    countryCode: 'GB',
    companyId: '10103078',
    incorporationDate: '2016-04-05',
    type: 'Private limited with share capital',
    simplifiedStatus: 'Active',
    charitableIdentitiesCount: 0,
    primaryWebsite: null,
    searchName: 'eleven fs group limited',
    filters: null,
    industries: [
      {
        name: 'Management consultancy activities (other than financial management)',
        type: 'SIC2007',
        code: '70229'
      },
      {
        type: 'SIC2003',
        code: '7414',
        name: 'Business and management consultancy activities'
      }
    ],
    legalEntityIdentifier: null,
    financialSummary: {
      netAssets: 1690396,
      totalAssets: 3023608,
      ebitda: null,
      postTaxProfit: null,
      turnover: null
    },
    name: 'Eleven FS Group Limited',
    docId: 'companies/aAEctklTWDgwaqgOjqIr',
    shareholders: [
      {
        firstName: 'DAVID',
        fullName: 'david brear',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 92000000
        },
        lastName: 'BREAR',
        shareCount: 100000,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '38.64',
        allInfo: '100,000.00 ORDINARY  GBP .00',
        shareholderType: 'P',
        type: 'shareholder',
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        totalShareholding: 0.3864,
        docId: 'persons/4lpjXMpZjjdgaiDCKmQD'
      },
      {
        lastName: 'BATES',
        firstName: 'JASON',
        fullName: 'jason bates',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 92000000
        },
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        shareCount: 62500,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '24.15',
        allInfo: '62,500.00 ORDINARY  GBP .00',
        shareholderType: 'P',
        type: 'shareholder',
        totalShareholding: 0.2415,
        docId: 'persons/oD2Mhtk4EeFBFaGkzql7'
      },
      {
        firstName: 'SIMON',
        fullName: 'simon taylor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 92000000
        },
        lastName: 'TAYLOR',
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        shareCount: 37500,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '14.49',
        allInfo: '37,500.00 ORDINARY  GBP .00',
        shareholderType: 'P',
        type: 'shareholder',
        totalShareholding: 0.1449,
        docId: 'persons/r8Tk50y4wxp18yNrMOah'
      },
      {
        firstName: 'ROSS',
        fullName: 'ross methven',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 93000000
        },
        lastName: 'METHVEN',
        shareholderType: 'P',
        type: 'shareholder',
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        shareCount: 37500,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '14.49',
        allInfo: '37,500.00 ORDINARY  GBP .00',
        totalShareholding: 0.1449,
        docId: 'persons/1nMoz6XokcTgjecg5bnZ'
      },
      {
        lastName: 'SKINNER',
        firstName: 'CHRIS',
        fullName: 'chris skinner',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 93000000
        },
        allInfo: '13,158.00 ORDINARY  GBP .00',
        shareholderType: 'P',
        type: 'shareholder',
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        shareCount: 13158,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '5.08',
        totalShareholding: 0.0508,
        docId: 'persons/DEy24b5rJxGzGZ8PfGIh'
      },
      {
        lastName: 'GANSKY',
        firstName: 'LISA',
        fullName: 'lisa gansky',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 93000000
        },
        allInfo: '8,139.00 ORDINARY  GBP .00',
        shareholderType: 'P',
        type: 'shareholder',
        shareType: 'ORDINARY',
        totalShareCount: 258797,
        shareCount: 8139,
        totalShares: 0,
        currency: 'GBP',
        nominalValue: '0.0010',
        totalShareValue: 0,
        percentage: '3.14',
        totalShareholding: 0.031400000000000004,
        docId: 'persons/CsTm7NIHuLVFzXO0Fxp1'
      }
    ],
    officers: [
      {
        nationality: 'Scottish',
        address2: '',
        name: 'Ross  Methven',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 283000000
        },
        directorships: {
          Directorship: [
            {
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '28/04/2016',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director'
            }
          ]
        },
        fullName: 'ross  methven',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'ross  methven',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/03/1976',
        type: 'officer'
      },
      {
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 282000000
        },
        directorships: {
          Directorship: [
            {
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '14/05/2019',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director'
            },
            {
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'FAST TRANSIENTS LIMITED',
              companyNumber: '09256228',
              appointedDate: '09/10/2014'
            },
            {
              appointedDate: '25/08/2000',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'WAPWORKER LIMITED',
              companyNumber: '04060268'
            },
            {
              companyName: 'AUTONOMIC SYSTEMS LIMITED',
              companyNumber: '05893043',
              appointedDate: '01/08/2006',
              companyStatus: 'Company is dissolved',
              'function': 'Director'
            }
          ]
        },
        fullName: 'ewan richard silver',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'ewan richard silver',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '21/05/1971',
        nationality: 'British',
        address2: '',
        name: 'Ewan Richard Silver',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        type: 'officer'
      },
      {
        searchName: 'lisa annette gansky',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/05/1958',
        nationality: 'American',
        address2: '',
        name: 'Lisa Annette Gansky',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 284000000
        },
        directorships: {
          Directorship: [
            {
              appointedDate: '01/01/2017',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078'
            }
          ]
        },
        fullName: 'lisa annette gansky',
        address6: '',
        address4: '',
        address5: '',
        type: 'officer'
      },
      {
        directorships: {
          Directorship: [
            {
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '14/05/2019',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director'
            },
            {
              companyNumber: '05777831',
              appointedDate: '19/10/2015',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'REPRIEVE'
            }
          ]
        },
        fullName: 'nasir asad ahmad',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'nasir asad ahmad',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/02/1978',
        nationality: 'British',
        address2: '',
        name: 'Nasir Asad Ahmad',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 283000000
        },
        type: 'officer'
      },
      {
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 283000000
        },
        directorships: {
          Directorship: [
            {
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '28/04/2016'
            },
            {
              companyNumber: '10116488',
              appointedDate: '11/04/2016',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'SJT CONSULTING GLOBAL LIMITED'
            }
          ]
        },
        fullName: 'simon  taylor',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'simon  taylor',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/07/1984',
        nationality: 'British',
        address2: '',
        name: 'Simon  Taylor',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        type: 'officer'
      },
      {
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 283000000
        },
        directorships: {
          Directorship: [
            {
              companyNumber: '10103078',
              appointedDate: '28/04/2016',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED'
            },
            {
              companyNumber: '06799739',
              appointedDate: '23/01/2009',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'HEART SHIFT LTD'
            },
            {
              companyName: 'CORPORATE STARTUP LTD',
              companyNumber: '08931904',
              appointedDate: '10/03/2014',
              companyStatus: 'Company is dissolved',
              'function': 'Director'
            }
          ]
        },
        fullName: 'jason craig bates',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'jason craig bates',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/03/1972',
        nationality: 'British',
        address2: '',
        name: 'Jason Craig Bates',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        type: 'officer'
      },
      {
        address4: '',
        address5: '',
        searchName: 'chris  skinner',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/06/1960',
        nationality: 'British',
        address2: '',
        name: 'Chris  Skinner',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 284000000
        },
        directorships: {
          Directorship: [
            {
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '01/11/2016'
            }
          ]
        },
        fullName: 'chris  skinner',
        address6: '',
        type: 'officer'
      },
      {
        nationality: 'British',
        address2: '',
        name: 'David Michael Brear',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 283000000
        },
        directorships: {
          Directorship: [
            {
              appointedDate: '03/02/2015',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'THINK DIFFERENT GROUP LIMITED',
              companyNumber: '09418119'
            },
            {
              companyNumber: '10018167',
              appointedDate: '22/02/2016',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'THINK DIFFERENT GROUP CAPITAL LIMITED'
            },
            {
              companyNumber: '09858391',
              appointedDate: '05/11/2015',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'THINK DIFFERENT GROUP RESEARCH LIMITED'
            },
            {
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '05/04/2016',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director'
            },
            {
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'THINK OUTSIDE HOLDINGS LIMITED',
              companyNumber: '10093843',
              appointedDate: '31/03/2016'
            },
            {
              appointedDate: '02/04/2014',
              companyStatus: 'Company is dissolved',
              'function': 'Director',
              companyName: 'R&D DIGITAL LIMITED',
              companyNumber: '08972445'
            }
          ]
        },
        fullName: 'david michael brear',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'david michael brear',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '30/12/1980',
        type: 'officer'
      },
      {
        name: 'Agapi Lida Glypti',
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 284000000
        },
        directorships: {
          Directorship: [
            {
              appointedDate: '14/05/2019',
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078'
            }
          ]
        },
        fullName: 'agapi lida glypti',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'agapi lida glypti',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/05/1978',
        nationality: 'Greek',
        address2: '',
        type: 'officer'
      },
      {
        address1: '1 Finsbury Avenue 11:fs, 2nd Floor',
        updatedAt: {
          _seconds: 1581529076,
          _nanoseconds: 284000000
        },
        directorships: {
          Directorship: [
            {
              companyStatus: 'Active - Accounts Filed',
              'function': 'Director',
              companyName: 'ELEVEN FS GROUP LIMITED',
              companyNumber: '10103078',
              appointedDate: '14/05/2019'
            }
          ]
        },
        fullName: 'ryan lee wareham',
        address6: '',
        address4: '',
        address5: '',
        searchName: 'ryan lee wareham',
        address3: 'London',
        postcode: 'EC2M 2PF',
        birthdate: '01/11/1981',
        nationality: 'British',
        address2: '',
        name: 'Ryan Lee Wareham',
        type: 'officer'
      }
    ],
    distinctShareholders: [
      {
        totalShareholding: 38.64,
        name: 'david brear',
        shareholderType: 'P',
        docId: 'persons/4lpjXMpZjjdgaiDCKmQD'
      },
      {
        totalShareholding: 24.15,
        name: 'jason bates',
        shareholderType: 'P',
        docId: 'persons/oD2Mhtk4EeFBFaGkzql7'
      },
      {
        totalShareholding: 14.49,
        name: 'simon taylor',
        shareholderType: 'P',
        docId: 'persons/r8Tk50y4wxp18yNrMOah'
      },
      {
        totalShareholding: 14.49,
        name: 'ross methven',
        shareholderType: 'P',
        docId: 'persons/1nMoz6XokcTgjecg5bnZ'
      },
      {
        totalShareholding: 5.08,
        name: 'chris skinner',
        shareholderType: 'P',
        docId: 'persons/DEy24b5rJxGzGZ8PfGIh'
      },
      {
        totalShareholding: 3.14,
        name: 'lisa gansky',
        shareholderType: 'P',
        docId: 'persons/CsTm7NIHuLVFzXO0Fxp1'
      }
    ]
  },
  country: { 'value': "GB", 'label': "United Kingdom 🇬🇧" },
  ownershipThreshold: 18,
  validation: {
    completion: {
      all: {
        passed: 11,
        total: 47
      },
      GB: {
        passed: 11,
        total: 39
      },
      DE: {
        passed: 11,
        total: 39
      },
      FR: {
        passed: 11,
        total: 42
      },
      RO: {
        passed: 11,
        total: 41
      },
      IT: {
        passed: 11,
        total: 38
      },
      SE: {
        passed: 11,
        total: 40
      }
    },
    errors: {
      numberofLocationsOrBranches: [
        'Numberof locations or branches can\'t be blank'
      ],
      contactFax: [
        'Contact fax can\'t be blank'
      ],
      vatId: [
        'Vat id can\'t be blank'
      ],
      bankMandatePassed: [
        'Bank mandate passed can\'t be blank'
      ],
      isInternetOnlyBusiness: [
        'Is internet only business can\'t be blank'
      ],
      nonCoopTaxJurisdictionsforFrance: [
        'Non coop tax jurisdictionsfor france can\'t be blank'
      ],
      natureOfBusiness: [
        'Nature of business can\'t be blank'
      ],
      materialChangeInBusinessActivity: [
        'Material change in business activity can\'t be blank'
      ],
      isListed: [
        'Is listed can\'t be blank'
      ],
      taxResidenceCountry: [
        'Tax residence country can\'t be blank'
      ],
      romanianFiscalRegistrationCertificatePassed: [
        'Romanian fiscal registration certificate passed can\'t be blank'
      ],
      lawSubjectTo: [
        'Law subject to can\'t be blank'
      ],
      incorporationDate: [
        'Incorporation date must be of type date'
      ],
      auditedFinancialStatementsProvided: [
        'Audited financial statements provided can\'t be blank'
      ],
      phoneNumber: [
        'Phone number can\'t be blank'
      ],
      homeBasedBusiness: [
        'Home based business can\'t be blank'
      ],
      taxId: [
        'Tax id can\'t be blank'
      ],
      contactEmail: [
        'Contact email can\'t be blank'
      ],
      'primaryAddress.fullAddress': [
        'Primary address full address can\'t be blank'
      ],
      materialMergers: [
        'Material mergers can\'t be blank'
      ],
      primaryWebsite: [
        'Primary website can\'t be blank'
      ],
      NAICSCode: [
        'Naicscode can\'t be blank'
      ],
      'incorporationAddress.fullAddress': [
        'Incorporation address full address can\'t be blank'
      ],
      isSubsidiaryOfListedEntity: [
        'Is subsidiary of listed entity can\'t be blank'
      ],
      doingBusinessAsName: [
        'Doing business as name can\'t be blank'
      ],
      sanctionsCountryChecksPassed: [
        'Sanctions country checks passed can\'t be blank'
      ],
      isListedCitiCoveredExchange: [
        'Is listed citi covered exchange can\'t be blank'
      ],
      boardOfDirectors: [
        'Board of directors can\'t be blank'
      ],
      holdClientFunds: [
        'Hold client funds can\'t be blank'
      ],
      AMLRedFlagsListPassed: [
        'Amlred flags list passed can\'t be blank'
      ],
      countriesOfPrimaryBusinessOperations: [
        'Countries of primary business operations can\'t be blank'
      ],
      industryType: [
        'Industry type can\'t be blank'
      ],
      siteVisitCompleted: [
        'Site visit completed can\'t be blank'
      ],
      AMLWatchListPassed: [
        'Amlwatch list passed can\'t be blank'
      ],
      sanctionsScreeningPassed: [
        'Sanctions screening passed can\'t be blank'
      ],
      adverseMediaCheckPassed: [
        'Adverse media check passed can\'t be blank'
      ]
    }
  }
};

export const screening = (state = initialState, action) => {
  switch (action.type) {
    case SET_COUNTRY:
      return {
        ...state,
        country: action.country,
      }

    case SET_COMPANY:
      return {
        ...state,
        company: action.company,
      }

    case SET_COMPANY_STRUCTURE:
      return {
        ...state,
        companyStructure: action.structure,
      }

    case SET_OWNERSHIP_THRESHOLD:
      return {
        ...state,
        ownershipThreshold: action.threshold,
      }

    case SET_COMPLETION:
      return {
        ...state,
        validation: {
          ...state.validation,
          completion: action.completion,
        }
      }

    case SET_ERRORS:
      return {
        ...state,
        validation: {
          ...state.validation,
          errors: action.errors,
        }
      }

    default:
      return state;
  }
};

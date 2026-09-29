import type { UserInputForm } from '../types';

export interface StateData {
  state: string;
  districts: {
    district: string;
    blocks: {
      block: string;
      villages: string[];
    }[];
  }[];
}

export const STATES_DATA: StateData[] = [
  {
    state: 'Andhra Pradesh',
    districts: [
      {
        district: 'Visakhapatnam',
        blocks: [
          { block: 'Anandapuram', villages: ['Vemulavalasa', 'Boni', 'Peda Tarla'] },
          { block: 'Bheemunipatnam', villages: ['Tagarapuvalasa', 'Nidigattu', 'Chittivalasa'] },
          { block: 'Pendurthi', villages: ['Chimalapalli', 'Saripalli', 'Sujathanagar'] }
        ]
      },
      {
        district: 'Guntur',
        blocks: [
          { block: 'Tenali', villages: ['Angalakuduru', 'Kolakaluru', 'Pinapadu'] },
          { block: 'Mangalagiri', villages: ['Atmakuru', 'Nowluru', 'Nutakki'] }
        ]
      },
      {
        district: 'Chittoor',
        blocks: [
          { block: 'Tirupati Rural', villages: ['Chandragiri', 'Perur', 'Avilala'] },
          { block: 'Madanapalle', villages: ['Kollabylu', 'Ponnetipalem', 'Valasapalle'] }
        ]
      }
    ]
  },
  {
    state: 'Arunachal Pradesh',
    districts: [
      {
        district: 'Papum Pare',
        blocks: [
          { block: 'Doimukh', villages: ['Emchi', 'Rono Hills', 'Karsingsa'] },
          { block: 'Sagalee', villages: ['Leporiang', 'Mengio', 'Torung'] }
        ]
      },
      {
        district: 'Changlang',
        blocks: [
          { block: 'Miao', villages: ['Kharsang', 'Namphai', 'Jairampur'] },
          { block: 'Bordumsa', villages: ['Diyun', 'Goju', 'Kherem'] }
        ]
      }
    ]
  },
  {
    state: 'Assam',
    districts: [
      {
        district: 'Kamrup Rural',
        blocks: [
          { block: 'Hajo', villages: ['Damdama', 'Sualkuchi', 'Pacharia'] },
          { block: 'Rangia', villages: ['Khandikar', 'Murara', 'Chepti'] }
        ]
      },
      {
        district: 'Dibrugarh',
        blocks: [
          { block: 'Chabua', villages: ['Dinjan', 'Jerai Gaon', 'Panitola'] },
          { block: 'Naharkatia', villages: ['Joypur', 'Namrup', 'Duliajan'] }
        ]
      },
      {
        district: 'Sonitpur',
        blocks: [
          { block: 'Dhekiajuli', villages: ['Singri', 'Thelamara', 'Sirajuli'] },
          { block: 'Tezpur', villages: ['Bindukuri', 'Dekargaon', 'Bhojkhowa'] }
        ]
      }
    ]
  },
  {
    state: 'Bihar',
    districts: [
      {
        district: 'Muzaffarpur',
        blocks: [
          { block: 'Kanti', villages: ['Damodarpur', 'Madhuban', 'Kolhua'] },
          { block: 'Motipur', villages: ['Singhasani', 'Tajpur', 'Barkurwa'] },
          { block: 'Musahari', villages: ['Bela', 'Rohan', 'Chhapra'] }
        ]
      },
      {
        district: 'Patna',
        blocks: [
          { block: 'Bihta', villages: ['Amnabad', 'Painal', 'Kanhauli'] },
          { block: 'Danapur', villages: ['Khagaul', 'Mustafapur', 'Usri'] },
          { block: 'Fatuha', villages: ['Sampatchak', 'Daniawan', 'Kachchi Dargah'] }
        ]
      },
      {
        district: 'Gaya',
        blocks: [
          { block: 'Bodh Gaya', villages: ['Bakrour', 'Mastipur', 'Mora'] },
          { block: 'Tekari', villages: ['Mau', 'Sherpur', 'Koch'] }
        ]
      },
      {
        district: 'Bhagalpur',
        blocks: [
          { block: 'Nathnagar', villages: ['Champanagar', 'Karanpura', 'Rampur'] },
          { block: 'Kahalgaon', villages: ['Colgong', 'Antichak', 'Sanokhar'] }
        ]
      }
    ]
  },
  {
    state: 'Chhattisgarh',
    districts: [
      {
        district: 'Raipur',
        blocks: [
          { block: 'Dharsiwa', villages: ['Tilda', 'Mandhar', 'Birgaon'] },
          { block: 'Abhanpur', villages: ['Manikchoura', 'Gobra Nawapara', 'Kendri'] }
        ]
      },
      {
        district: 'Bilaspur',
        blocks: [
          { block: 'Bilha', villages: ['Bodri', 'Hirri', 'Chakarbhatha'] },
          { block: 'Kota', villages: ['Ratanpur', 'Belgahna', 'Ganiyari'] }
        ]
      },
      {
        district: 'Bastar',
        blocks: [
          { block: 'Jagdalpur', villages: ['Asna', 'Nagarnar', 'Kumhrawand'] },
          { block: 'Bastanar', villages: ['Tokapal', 'Lohandiguda', 'Killepal'] }
        ]
      }
    ]
  },
  {
    state: 'Goa',
    districts: [
      {
        district: 'North Goa',
        blocks: [
          { block: 'Bardez', villages: ['Mapusa', 'Calangute', 'Aldona', 'Siolim'] },
          { block: 'Pernem', villages: ['Mandrem', 'Morjim', 'Arambol'] },
          { block: 'Ponda', villages: ['Curti', 'Bandora', 'Priol'] }
        ]
      },
      {
        district: 'South Goa',
        blocks: [
          { block: 'Salcete', villages: ['Margao', 'Navelim', 'Benaulim', 'Nuvem'] },
          { block: 'Quepem', villages: ['Curchorem', 'Sanvordem', 'Balli'] }
        ]
      }
    ]
  },
  {
    state: 'Gujarat',
    districts: [
      {
        district: 'Ahmedabad',
        blocks: [
          { block: 'Sanand', villages: ['Changodar', 'Moraiya', 'Nalsarovar'] },
          { block: 'Dholka', villages: ['Koth', 'Bavla', 'Saragwala'] },
          { block: 'Viramgam', villages: ['Mandal', 'Detroj', 'Jakhwada'] }
        ]
      },
      {
        district: 'Anand',
        blocks: [
          { block: 'Amul Milk Catchment', villages: ['Mogari', 'Bakrol', 'Hadgood'] },
          { block: 'Petlad', villages: ['Dharmaj', 'Sunav', 'Sojitra'] }
        ]
      },
      {
        district: 'Surat',
        blocks: [
          { block: 'Bardoli', villages: ['Madhi', 'Kadod', 'Baben'] },
          { block: 'Olpad', villages: ['Sayan', 'Kim', 'Karanj'] }
        ]
      },
      {
        district: 'Rajkot',
        blocks: [
          { block: 'Gondal', villages: ['Ribda', 'Bhojpara', 'Gomta'] },
          { block: 'Jasdan', villages: ['Atkot', 'Vinchhiya', 'Kamalpur'] }
        ]
      }
    ]
  },
  {
    state: 'Haryana',
    districts: [
      {
        district: 'Karnal',
        blocks: [
          { block: 'Nilokheri', villages: ['Taraori', 'Nissing', 'Pundri'] },
          { block: 'Gharaunda', villages: ['Kohand', 'Kaimla', 'Chaura'] }
        ]
      },
      {
        district: 'Hisar',
        blocks: [
          { block: 'Hansi', villages: ['Sisai', 'Bhiwani Rohilla', 'Narnaund'] },
          { block: 'Barwala', villages: ['Khedar', 'Panghal', 'Daulatpur'] }
        ]
      },
      {
        district: 'Ambala',
        blocks: [
          { block: 'Barara', villages: ['Adhoya', 'Talheri', 'Saha'] },
          { block: 'Naraingarh', villages: ['Shahzadpur', 'Bari', 'Laha'] }
        ]
      }
    ]
  },
  {
    state: 'Himachal Pradesh',
    districts: [
      {
        district: 'Kangra',
        blocks: [
          { block: 'Palampur', villages: ['Maranda', 'Gopalpur', 'Holta'] },
          { block: 'Kangra', villages: ['Nagrota Bagwan', 'Shahpur', 'Matour'] }
        ]
      },
      {
        district: 'Shimla',
        blocks: [
          { block: 'Rampur', villages: ['Nankhari', 'Kumarsain', 'Sarahan'] },
          { block: 'Theog', villages: ['Kotkhai', 'Fagu', 'Matiana'] }
        ]
      },
      {
        district: 'Mandi',
        blocks: [
          { block: 'Sunder Nagar', villages: ['Bhojpur', 'Dehar', 'Slapper'] },
          { block: 'Karsog', villages: ['Churag', 'Mamel', 'Kao'] }
        ]
      }
    ]
  },
  {
    state: 'Jharkhand',
    districts: [
      {
        district: 'Ranchi',
        blocks: [
          { block: 'Namkum', villages: ['Tatisilwai', 'Rajaulatu', 'Lalgutwa'] },
          { block: 'Ormanjhi', villages: ['Irba', 'Chutupalu', 'Dardag'] },
          { block: 'Kanke', villages: ['Sukhurhutu', 'Arsande', 'Pithoria'] }
        ]
      },
      {
        district: 'East Singhbhum',
        blocks: [
          { block: 'Ghatshila', villages: ['Galudih', 'Mouhanda', 'Dhalbhumgarh'] },
          { block: 'Potka', villages: ['Kowali', 'Jadugora', 'Hata'] }
        ]
      },
      {
        district: 'Dhanbad',
        blocks: [
          { block: 'Govindpur', villages: ['Barwadda', 'Nagarnar', 'Saraidhela'] },
          { block: 'Nirsa', villages: ['Mugma', 'Kumardhubi', 'Chirkunda'] }
        ]
      }
    ]
  },
  {
    state: 'Karnataka',
    districts: [
      {
        district: 'Bengaluru Rural',
        blocks: [
          { block: 'Doddaballapura', villages: ['Tubagere', 'Kasaba', 'Sasalu'] },
          { block: 'Devanahalli', villages: ['Kundana', 'Vijayapura', 'Channarayapatna'] },
          { block: 'Nelamangala', villages: ['Tyamagondlu', 'Sompura', 'Doddabele'] }
        ]
      },
      {
        district: 'Mysuru',
        blocks: [
          { block: 'Nanjangud', villages: ['Hullahalli', 'Kavalande', 'Tagadur'] },
          { block: 'Hunsur', villages: ['Bilikere', 'Gavadagere', 'Rathehalli'] }
        ]
      },
      {
        district: 'Belagavi',
        blocks: [
          { block: 'Gokak', villages: ['Konnur', 'Ankalgi', 'Mamdapur'] },
          { block: 'Chikkodi', villages: ['Nipani', 'Sadalga', 'Kallolli'] }
        ]
      },
      {
        district: 'Mandya',
        blocks: [
          { block: 'Maddur', villages: ['Koppa', 'Besagarahalli', 'Kestur'] },
          { block: 'Pandavapura', villages: ['Melukote', 'Chinya', 'Kattebelagola'] }
        ]
      }
    ]
  },
  {
    state: 'Kerala',
    districts: [
      {
        district: 'Ernakulam',
        blocks: [
          { block: 'Aluva', villages: ['Kizhakkambalam', 'Chengamanad', 'Chowwara'] },
          { block: 'Muvattupuzha', villages: ['Arakuzha', 'Velloorkunnam', 'Marady'] }
        ]
      },
      {
        district: 'Palakkad',
        blocks: [
          { block: 'Chittur', villages: ['Kollengode', 'Nenmara', 'Koduvayur'] },
          { block: 'Ottapalam', villages: ['Shoranur', 'Pattambi', 'Cherpulassery'] }
        ]
      },
      {
        district: 'Wayanad',
        blocks: [
          { block: 'Sulthan Bathery', villages: ['Ambalavayal', 'Noolpuzha', 'Meenangadi'] },
          { block: 'Mananthavady', villages: ['Panamaram', 'Thirunelly', 'Vellamunda'] }
        ]
      }
    ]
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      {
        district: 'Indore',
        blocks: [
          { block: 'Mhow', villages: ['Harsola', 'Manpur', 'Kodariya'] },
          { block: 'Depalpur', villages: ['Gautampura', 'Betma', 'Ralamandal'] },
          { block: 'Sanwer', villages: ['Kshipra', 'Dharmat', 'Ajnod'] }
        ]
      },
      {
        district: 'Bhopal',
        blocks: [
          { block: 'Berasia', villages: ['Nazirabad', 'Lalariya', 'Runaha'] },
          { block: 'Phanda', villages: ['Ratibad', 'Misrod', 'Bairagarh Kalan'] }
        ]
      },
      {
        district: 'Jabalpur',
        blocks: [
          { block: 'Sihora', villages: ['Majholi', 'Goshalpur', 'Dhamki'] },
          { block: 'Patan', villages: ['Katangi', 'Shahpura', 'Belkheda'] }
        ]
      },
      {
        district: 'Ujjain',
        blocks: [
          { block: 'Nagda', villages: ['Khachrod', 'Unhel', 'Bhatpachlana'] },
          { block: 'Badnagar', villages: ['Ingoria', 'Runija', 'Mullapura'] }
        ]
      }
    ]
  },
  {
    state: 'Maharashtra',
    districts: [
      {
        district: 'Satara',
        blocks: [
          { block: 'Karad', villages: ['Koregaon', 'Masur', 'Shenoli', 'Umbraj'] },
          { block: 'Patan', villages: ['Dhebewadi', 'Tarale', 'Helwak'] },
          { block: 'Wai', villages: ['Bhuinj', 'Surur', 'Pachwad'] }
        ]
      },
      {
        district: 'Pune',
        blocks: [
          { block: 'Baramati', villages: ['Malegaon', 'Songaon', 'Katewadi'] },
          { block: 'Shirur', villages: ['Shikrapur', 'Narayangaon', 'Pabal'] },
          { block: 'Khed (Rajgurunagar)', villages: ['Chakan', 'Alandi', 'Waki'] }
        ]
      },
      {
        district: 'Nashik',
        blocks: [
          { block: 'Niphad', villages: ['Pimpalgaon Baswant', 'Lasalgaon', 'Ranwad'] },
          { block: 'Dindori', villages: ['Vani', 'Janori', 'Khedgaon'] }
        ]
      },
      {
        district: 'Kolhapur',
        blocks: [
          { block: 'Shirol', villages: ['Jaysingpur', 'Kurundwad', 'Narsingpur'] },
          { block: 'Hatkanangale', villages: ['Hupari', 'Ichalkaranji Rural', 'Rukadi'] }
        ]
      },
      {
        district: 'Nagpur',
        blocks: [
          { block: 'Katol', villages: ['Kondhali', 'Paradsinga', 'Sonkhamb'] },
          { block: 'Umred', villages: ['Bhiwapur', 'Kuhi', 'Sirsi'] }
        ]
      }
    ]
  },
  {
    state: 'Manipur',
    districts: [
      {
        district: 'Imphal East',
        blocks: [
          { block: 'Porompat', villages: ['Sawombung', 'Andro', 'Keirao'] },
          { block: 'Keirao Bitra', villages: ['Nongpok Sekmai', 'Yairipok', 'Top Dusara'] }
        ]
      },
      {
        district: 'Churachandpur',
        blocks: [
          { block: 'Tuibong', villages: ['Henglep', 'Singngat', 'Samulamlan'] }
        ]
      }
    ]
  },
  {
    state: 'Meghalaya',
    districts: [
      {
        district: 'East Khasi Hills',
        blocks: [
          { block: 'Mawkynrew', villages: ['Smit', 'Jongsha', 'Mylliem'] },
          { block: 'Mawphlang', villages: ['Tyngngur', 'Laitkyrhong', 'Mawsynram'] }
        ]
      },
      {
        district: 'Ri-Bhoi',
        blocks: [
          { block: 'Umsning', villages: ['Nongpoh', 'Byrnihat', 'Barapani'] }
        ]
      }
    ]
  },
  {
    state: 'Mizoram',
    districts: [
      {
        district: 'Aizawl',
        blocks: [
          { block: 'Tlangnuam', villages: ['Selesih', 'Durtlang', 'Tanhril'] },
          { block: 'Thingsulthliah', villages: ['Baktawng', 'Khawruhlian', 'Phullen'] }
        ]
      },
      {
        district: 'Lunglei',
        blocks: [
          { block: 'Lunglei Central', villages: ['Hnahthial', 'Tlabung', 'Lungsen'] }
        ]
      }
    ]
  },
  {
    state: 'Nagaland',
    districts: [
      {
        district: 'Kohima',
        blocks: [
          { block: 'Kohima Rural', villages: ['Jakhama', 'Viswema', 'Khonoma'] },
          { block: 'Tseminyu', villages: ['Chunlikha', 'Tesophenyu', 'Kithagha'] }
        ]
      },
      {
        district: 'Dimapur',
        blocks: [
          { block: 'Medziphema', villages: ['Chumukedima', 'Dhansiripar', 'Kuhuboto'] }
        ]
      }
    ]
  },
  {
    state: 'Odisha',
    districts: [
      {
        district: 'Cuttack',
        blocks: [
          { block: 'Athagarh', villages: ['Khuntuni', 'Radhakishorepur', 'Rajathagarh'] },
          { block: 'Salepur', villages: ['Nischintakoili', 'Mahanga', 'Bahugram'] }
        ]
      },
      {
        district: 'Khordha',
        blocks: [
          { block: 'Jatani', villages: ['Jatani Rural', 'Khurda Town Catchment', 'Maniabandha'] },
          { block: 'Balianta', villages: ['Balipatna', 'Bhingarpur', 'Pratapsasan'] }
        ]
      },
      {
        district: 'Sambalpur',
        blocks: [
          { block: 'Kuchinda', villages: ['Bamra', 'Jamankira', 'Mahulpali'] },
          { block: 'Maneswar', villages: ['Dhankauda', 'Rengali', 'Jujumura'] }
        ]
      }
    ]
  },
  {
    state: 'Punjab',
    districts: [
      {
        district: 'Ludhiana',
        blocks: [
          { block: 'Samrala', villages: ['Machhiwara', 'Khanna Rural', 'Mullanpur Dakha'] },
          { block: 'Jagraon', villages: ['Raikot', 'Sidhwan Bet', 'Bhundri'] }
        ]
      },
      {
        district: 'Amritsar',
        blocks: [
          { block: 'Majitha', villages: ['Attari', 'Jandiala Guru', 'Verka'] },
          { block: 'Ajnala', villages: ['Chogawan', 'Harsha Chhina', 'Ramdas'] }
        ]
      },
      {
        district: 'Patiala',
        blocks: [
          { block: 'Nabha', villages: ['Bhadson', 'Samana', 'Patran'] },
          { block: 'Rajpura', villages: ['Ghanaur', 'Shambhu Kalan', 'Kalka Mod'] }
        ]
      }
    ]
  },
  {
    state: 'Rajasthan',
    districts: [
      {
        district: 'Jaipur',
        blocks: [
          { block: 'Chamu', villages: ['Kala Dera', 'Bhojpura', 'Kishanpura'] },
          { block: 'Sanganer', villages: ['Muhana', 'Vatika', 'Nevta'] },
          { block: 'Amer', villages: ['Kukas', 'Achrol', 'Chomu'] }
        ]
      },
      {
        district: 'Jodhpur',
        blocks: [
          { block: 'Mandore', villages: ['Salawas', 'Pal', 'Banar'] },
          { block: 'Osian', villages: ['Tiwari', 'Bhopalgarh', 'Mathania'] }
        ]
      },
      {
        district: 'Udaipur',
        blocks: [
          { block: 'Girwa', villages: ['Bhuwana', 'Dabok', 'Bedla'] },
          { block: 'Mavli', villages: ['Fatehnagar', 'Vallabhnagar', 'Sanwar'] }
        ]
      },
      {
        district: 'Kota',
        blocks: [
          { block: 'Ladpura', villages: ['Mandana', 'Kethun', 'Kasba Nonera'] },
          { block: 'Ramganj Mandi', villages: ['Chechat', 'Morak', 'Kumbhkot'] }
        ]
      }
    ]
  },
  {
    state: 'Sikkim',
    districts: [
      {
        district: 'East Sikkim',
        blocks: [
          { block: 'Gangtok Rural', villages: ['Ranipool', 'Singtam', 'Rongli'] },
          { block: 'Pakyong', villages: ['Rhenock', 'Duga', 'Majhitar'] }
        ]
      },
      {
        district: 'South Sikkim',
        blocks: [
          { block: 'Namchi', villages: ['Jorethang', 'Ravangla', 'Temi Tarku'] }
        ]
      }
    ]
  },
  {
    state: 'Tamil Nadu',
    districts: [
      {
        district: 'Namakkal',
        blocks: [
          { block: 'Rasipuram', villages: ['Pattanam', 'Vennandur', 'Mangalapuram'] },
          { block: 'Tiruchengode', villages: ['Mallasamudram', 'Elachipalayam', 'Kokkarayanpettai'] },
          { block: 'Paramathi Velur', villages: ['Kabilarmalai', 'Pandamangalam', 'Jedarpalayam'] }
        ]
      },
      {
        district: 'Coimbatore',
        blocks: [
          { block: 'Pollachi', villages: ['Anaimalai', 'Kinathukadavu', 'Negamam'] },
          { block: 'Sulur', villages: ['Karanampettai', 'Somanur', 'Sulur Rural'] }
        ]
      },
      {
        district: 'Madurai',
        blocks: [
          { block: 'Melur', villages: ['Kottampatti', 'Vellalur', 'Therkutheru'] },
          { block: 'Vadipatti', villages: ['Alanganallur', 'Palamedu', 'Sholavandan'] }
        ]
      },
      {
        district: 'Salem',
        blocks: [
          { block: 'Attur', villages: ['Thalaivasal', 'Peddanayakanpalayam', 'Mallur'] },
          { block: 'Omalur', villages: ['Mecheri', 'Kadayampatti', 'Tharamangalam'] }
        ]
      }
    ]
  },
  {
    state: 'Telangana',
    districts: [
      {
        district: 'Warangal',
        blocks: [
          { block: 'Hanamkonda Rural', villages: ['Kazipet Rural', 'Hasanparthy', 'Dharmasagar'] },
          { block: 'Narsampet', villages: ['Chennaraopet', 'Duggondi', 'Khanapur'] }
        ]
      },
      {
        district: 'Karimnagar',
        blocks: [
          { block: 'Huzurabad', villages: ['Jammikunta', 'Veenavanka', 'Ellanthakunta'] },
          { block: 'Choppadandi', villages: ['Gangadhara', 'Ramadugu', 'Kothapalli'] }
        ]
      },
      {
        district: 'Nalgonda',
        blocks: [
          { block: 'Miryalaguda', villages: ['Damaracherla', 'Vemulapally', 'Madgulapally'] },
          { block: 'Suryapet Catchment', villages: ['Chivvemla', 'Mothey', 'Penpahad'] }
        ]
      }
    ]
  },
  {
    state: 'Tripura',
    districts: [
      {
        district: 'West Tripura',
        blocks: [
          { block: 'Jirania', villages: ['Ranirbazar', 'Champaknagar', 'Majlishpur'] },
          { block: 'Mohanpur', villages: ['Lefunga', 'Hezamara', 'Simna'] }
        ]
      },
      {
        district: 'Gomati',
        blocks: [
          { block: 'Udaipur Rural', villages: ['Matabari', 'Kakraban', 'Killa'] }
        ]
      }
    ]
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      {
        district: 'Varanasi',
        blocks: [
          { block: 'Arajiline', villages: ['Raja Talab', 'Bikapur', 'Kharawan', 'Shahbanspur'] },
          { block: 'Kashi Vidyapeeth', villages: ['Manduadih', 'Shivpur', 'Lohta', 'Rohania'] },
          { block: 'Pindra', villages: ['Phulpur', 'Sindhora', 'Basni', 'Koirajpur'] },
          { block: 'Chiraigaon', villages: ['Chaubeypur', 'Dharahara', 'Rustampur'] }
        ]
      },
      {
        district: 'Gorakhpur',
        blocks: [
          { block: 'Pipraich', villages: ['Maharajganj Rd', 'Bishunpur', 'Belghat'] },
          { block: 'Sahjanwa', villages: ['Bhadohi', 'Ghagha', 'Chhapia'] },
          { block: 'Campierganj', villages: ['Peppeganj', 'Rawatganj', 'Machhligao'] }
        ]
      },
      {
        district: 'Lucknow',
        blocks: [
          { block: 'Bakshi Ka Talab', villages: ['Itaunja', 'Kathwara', 'Mahuakalan'] },
          { block: 'Sarojini Nagar', villages: ['Banthra', 'Gosainganj', 'Mohanlalganj'] }
        ]
      },
      {
        district: 'Agra',
        blocks: [
          { block: 'Fatehabad', villages: ['Doki', 'Samoga', 'Nibohra'] },
          { block: 'Kheragarh', villages: ['Saiyan', 'Jagnair', 'Iradatnagar'] }
        ]
      },
      {
        district: 'Prayagraj',
        blocks: [
          { block: 'Phulpur', villages: ['Sahson', 'Mungra Badshahpur Rd', 'Jhusi Rural'] },
          { block: 'Koraon', villages: ['Manda', 'Meja', 'Khiri'] }
        ]
      },
      {
        district: 'Meerut',
        blocks: [
          { block: 'Mawana', villages: ['Hastinapur', 'Bahsuma', 'Kithore'] },
          { block: 'Sardhana', villages: ['Daurala', 'Rohta', 'Lawar'] }
        ]
      }
    ]
  },
  {
    state: 'Uttarakhand',
    districts: [
      {
        district: 'Dehradun',
        blocks: [
          { block: 'Vikasnagar', villages: ['Herbertpur', 'Sahaspur', 'Dakpathar'] },
          { block: 'Doiwala', villages: ['Rishikesh Rural', 'Rani Pokhari', 'Bhogpur'] }
        ]
      },
      {
        district: 'Haridwar',
        blocks: [
          { block: 'Roorkee', villages: ['Manglaur', 'Bhagwanpur', 'Piran Kaliyar'] },
          { block: 'Laksar', villages: ['Khanpur', 'Sultanpur', 'Raisi'] }
        ]
      },
      {
        district: 'Udham Singh Nagar',
        blocks: [
          { block: 'Kashipur', villages: ['Mahukhera', 'Kundeshwari', 'Aliganj'] },
          { block: 'Khatima', villages: ['Sitarganj', 'Nanakmatta', 'Jhimmighat'] }
        ]
      }
    ]
  },
  {
    state: 'West Bengal',
    districts: [
      {
        district: 'Birbhum',
        blocks: [
          { block: 'Bolpur-Sriniketan', villages: ['Ilambazar', 'Supur', 'Kasba', 'Kankalitala'] },
          { block: 'Suri I', villages: ['Alunda', 'Khatanga', 'Karidhya'] },
          { block: 'Rampurhat', villages: ['Nalhati', 'Tarapith Rural', 'Mallarpur'] }
        ]
      },
      {
        district: 'Murshidabad',
        blocks: [
          { block: 'Berhampore', villages: ['Baharampur Rural', 'Hariharpara', 'Naoda'] },
          { block: 'Kandi', villages: ['Bharatpur', 'Khargram', 'Burwan'] }
        ]
      },
      {
        district: 'Burdwan (Purba Bardhaman)',
        blocks: [
          { block: 'Kalna', villages: ['Dhatrigram', 'Baidyapur', 'Samudragarh'] },
          { block: 'Katwa', villages: ['Dainhat', 'Ketugram', 'Mangalkote'] }
        ]
      },
      {
        district: 'North 24 Parganas',
        blocks: [
          { block: 'Barasat I', villages: ['Duttapukur', 'Kadambagachi', 'Chhota Jagulia'] },
          { block: 'Basirhat II', villages: ['Baduria', 'Swarupnagar', 'Minakhan'] }
        ]
      }
    ]
  },
  {
    state: 'Delhi (NCT)',
    districts: [
      {
        district: 'North West Delhi',
        blocks: [
          { block: 'Alipur', villages: ['Bakhtawarpur', 'Khammpur', 'Hiranki'] },
          { block: 'Narela', villages: ['Bawana Rural', 'Holambi Kalan', 'Tikri Khurd'] }
        ]
      },
      {
        district: 'South West Delhi',
        blocks: [
          { block: 'Najafgarh', villages: ['Dichaon Kalan', 'Jharoda Kalan', 'Mitraon'] },
          { block: 'Kanganheri', villages: ['Chhawla', 'Qutubgarh', 'Ghuman Hera'] }
        ]
      }
    ]
  },
  {
    state: 'Jammu and Kashmir',
    districts: [
      {
        district: 'Srinagar',
        blocks: [
          { block: 'Srinagar North', villages: ['Harwan', 'Shalimar Rural', 'Zakura'] },
          { block: 'Srinagar South', villages: ['Nowgam', 'Lasjan', 'Pantha Chowk'] }
        ]
      },
      {
        district: 'Jammu',
        blocks: [
          { block: 'RS Pura', villages: ['Suchetgarh', 'Bishnah', 'Arnia'] },
          { block: 'Akhnoor', villages: ['Khour', 'Jourian', 'Chowki Choura'] }
        ]
      },
      {
        district: 'Anantnag',
        blocks: [
          { block: 'Bijbehara', villages: ['Pahalgam Rural', 'Mattan', 'Achabal'] }
        ]
      }
    ]
  },
  {
    state: 'Ladakh',
    districts: [
      {
        district: 'Leh',
        blocks: [
          { block: 'Leh Rural', villages: ['Chuchot', 'Thiksey', 'Stok'] },
          { block: 'Nubra', villages: ['Diskit', 'Hunder', 'Turtuk'] }
        ]
      },
      {
        district: 'Kargil',
        blocks: [
          { block: 'Kargil Central', villages: ['Drass', 'Sankoo', 'Zanskar'] }
        ]
      }
    ]
  },
  {
    state: 'Puducherry',
    districts: [
      {
        district: 'Puducherry',
        blocks: [
          { block: 'Villianur', villages: ['Bahour', 'Ozhukarai Rural', 'Ariyankuppam'] }
        ]
      },
      {
        district: 'Karaikal',
        blocks: [
          { block: 'Karaikal Rural', villages: ['Nedungadu', 'Kottucherry', 'Neravy'] }
        ]
      }
    ]
  },
  {
    state: 'Chandigarh',
    districts: [
      {
        district: 'Chandigarh UT',
        blocks: [
          { block: 'Manimajra Rural', villages: ['Dhanas', 'Maloya', 'Kaimbwala', 'Khuda Alisher'] }
        ]
      }
    ]
  },
  {
    state: 'Dadra and Nagar Haveli and Daman and Diu',
    districts: [
      {
        district: 'Dadra and Nagar Haveli',
        blocks: [
          { block: 'Silvassa Rural', villages: ['Khanvel', 'Naroli', 'Rakholi', 'Dapada'] }
        ]
      },
      {
        district: 'Daman',
        blocks: [
          { block: 'Daman Rural', villages: ['Kachigam', 'Bhimpore', 'Varkund'] }
        ]
      }
    ]
  },
  {
    state: 'Andaman and Nicobar Islands',
    districts: [
      {
        district: 'South Andaman',
        blocks: [
          { block: 'Ferrargunj', villages: ['Tushnabad', 'Wimberlygunj', 'Bambooflat'] }
        ]
      }
    ]
  },
  {
    state: 'Lakshadweep',
    districts: [
      {
        district: 'Lakshadweep District',
        blocks: [
          { block: 'Kavaratti Island', villages: ['Agatti', 'Andrott', 'Minicoy'] }
        ]
      }
    ]
  }
];

export interface RegionalArchetype {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  formData: UserInputForm;
}

export type DemoPreset = RegionalArchetype;

export const REGIONAL_ARCHETYPES: RegionalArchetype[] = [
  {
    id: 'preset_oil_mill',
    title: 'Ramesh Patel • Mustard Oil Expeller',
    subtitle: 'Varanasi, UP (₹80,000 Margin -> ₹8 Lakh Project)',
    badge: 'Term Loan (8%)',
    formData: {
      location: {
        state: 'Uttar Pradesh',
        district: 'Varanasi',
        block: 'Arajiline',
        village: 'Raja Talab',
        pinCode: '221311',
        areaType: 'rural',
        catchmentRadiusKm: 10
      },
      businessCategoryId: 'mustard_oil_mill',
      availableMarginCapital: 80000,
      entrepreneurName: 'Ramesh Patel',
      priorExperienceYears: 3,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 18,
      preferredLanguage: 'en'
    }
  },
  {
    id: 'preset_micro_dairy',
    title: 'Sunita Gaikwad • Dairy Farming Unit',
    subtitle: 'Satara, Maharashtra (₹12,000 Margin -> ₹1.2 Lakh Project)',
    badge: 'Micro Finance (6.5%)',
    formData: {
      location: {
        state: 'Maharashtra',
        district: 'Satara',
        block: 'Karad',
        village: 'Umbraj',
        pinCode: '415109',
        areaType: 'rural',
        catchmentRadiusKm: 5
      },
      businessCategoryId: 'dairy_farming',
      availableMarginCapital: 12000,
      entrepreneurName: 'Sunita Gaikwad',
      priorExperienceYears: 2,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 16,
      preferredLanguage: 'hi'
    }
  },
  {
    id: 'preset_garments',
    title: 'Anil Sen • Garment Stitching Center',
    subtitle: 'Birbhum, West Bengal (₹25,000 Margin -> ₹2.5 Lakh Project)',
    badge: 'Term Loan (8%)',
    formData: {
      location: {
        state: 'West Bengal',
        district: 'Birbhum',
        block: 'Bolpur-Sriniketan',
        village: 'Ilambazar',
        pinCode: '731214',
        areaType: 'semi-urban',
        catchmentRadiusKm: 10
      },
      businessCategoryId: 'garment_stitching',
      availableMarginCapital: 25000,
      entrepreneurName: 'Anil Sen',
      priorExperienceYears: 4,
      hasOwnLandShed: false,
      electricityAvailabilityHours: 20,
      preferredLanguage: 'en'
    }
  },
  {
    id: 'preset_spices',
    title: 'Meena Sharma • Spice Grinding & Packaging',
    subtitle: 'Jaipur, Rajasthan (₹14,000 Margin -> ₹1.4 Lakh Project)',
    badge: 'Micro Finance (6.5%)',
    formData: {
      location: {
        state: 'Rajasthan',
        district: 'Jaipur',
        block: 'Chamu',
        village: 'Kala Dera',
        pinCode: '303801',
        areaType: 'rural',
        catchmentRadiusKm: 5
      },
      businessCategoryId: 'spice_grinding',
      availableMarginCapital: 14000,
      entrepreneurName: 'Meena Sharma',
      priorExperienceYears: 1,
      hasOwnLandShed: true,
      electricityAvailabilityHours: 16,
      preferredLanguage: 'hi'
    }
  }
];

export const DEMO_PRESETS = REGIONAL_ARCHETYPES;

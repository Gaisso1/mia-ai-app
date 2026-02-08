
import { Ride, RidingPace } from './types';

export const MOCK_RIDES: Ride[] = [
  {
    id: '1',
    title: 'Domenica al Passo San Marco',
    country: 'Italia',
    region: 'Lombardia',
    province: 'Sondrio',
    location: 'Passo San Marco',
    departurePoint: 'Piazza Castello, Milano',
    departureTime: '2024-06-15T09:00:00',
    description: 'Un classico intramontabile. Partiamo da Milano, facciamo un po\' di superstrada fino a Lecco e poi ci godiamo le curve della Val Gerola fino in cima al San Marco. Pranzo al rifugio previsto per le 13:00.',
    pace: RidingPace.ALLEGRO,
    organizer: { id: 'u1', name: 'Marco B.', avatar: 'https://picsum.photos/id/64/100/100', bike: 'Ducati Multistrada' },
    participants: [
      { id: 'u1', name: 'Marco B.', avatar: 'https://picsum.photos/id/64/100/100' },
      { id: 'u2', name: 'Sara L.', avatar: 'https://picsum.photos/id/65/100/100' },
      { id: 'u3', name: 'Luca M.', avatar: 'https://picsum.photos/id/66/100/100' }
    ],
    comments: [
      { id: 'c1', userId: 'u2', userName: 'Sara L.', userAvatar: 'https://picsum.photos/id/65/100/100', text: 'Presente! Ci vediamo lì.', timestamp: '2024-06-10T14:30:00' }
    ],
    imageUrl: 'https://picsum.photos/id/10/800/400',
    mapCoords: { lat: 46.0494, lng: 9.6247 }
  },
  {
    id: '2',
    title: 'Giro del Garda Relax',
    country: 'Italia',
    region: 'Veneto',
    province: 'Verona',
    location: 'Lago di Garda',
    departurePoint: 'Stazione di Verona',
    departureTime: '2024-06-16T10:30:00',
    description: 'Giro panoramico intorno al lago. Niente fretta, tante soste foto e gelato a Limone sul Garda.',
    pace: RidingPace.TRANQUILLO,
    organizer: { id: 'u4', name: 'Elena G.', avatar: 'https://picsum.photos/id/67/100/100', bike: 'Moto Guzzi V7' },
    participants: [
      { id: 'u4', name: 'Elena G.', avatar: 'https://picsum.photos/id/67/100/100' }
    ],
    comments: [],
    imageUrl: 'https://picsum.photos/id/11/800/400',
    mapCoords: { lat: 45.6277, lng: 10.6696 }
  }
];

export const REGIONS = [
  'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 
  'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche', 
  'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 
  'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
].sort();

export const PROVINCES: Record<string, string[]> = {
  'Abruzzo': ['L\'Aquila', 'Chieti', 'Pescara', 'Teramo'],
  'Basilicata': ['Matera', 'Potenza'],
  'Calabria': ['Catanzaro', 'Cosenza', 'Crotone', 'Reggio Calabria', 'Vibo Valentia'],
  'Campania': ['Avellino', 'Benevento', 'Caserta', 'Napoli', 'Salerno'],
  'Emilia-Romagna': ['Bologna', 'Ferrara', 'Forlì-Cesena', 'Modena', 'Parma', 'Piacenza', 'Ravenna', 'Reggio Emilia', 'Rimini'],
  'Friuli-Venezia Giulia': ['Gorizia', 'Pordenone', 'Trieste', 'Udine'],
  'Lazio': ['Frosinone', 'Latina', 'Rieti', 'Roma', 'Viterbo'],
  'Liguria': ['Genova', 'Imperia', 'La Spezia', 'Savona'],
  'Lombardia': ['Bergamo', 'Brescia', 'Como', 'Cremona', 'Lecco', 'Lodi', 'Mantova', 'Milano', 'Monza e della Brianza', 'Pavia', 'Sondrio', 'Varese'],
  'Marche': ['Ancona', 'Ascoli Piceno', 'Fermo', 'Macerata', 'Pesaro e Urbino'],
  'Molise': ['Campobasso', 'Isernia'],
  'Piemonte': ['Alessandria', 'Asti', 'Biella', 'Cuneo', 'Novara', 'Torino', 'Verbano-Cusio-Ossola', 'Vercelli'],
  'Puglia': ['Bari', 'Barletta-Andria-Trani', 'Brindisi', 'Foggia', 'Lecce', 'Taranto'],
  'Sardegna': ['Cagliari', 'Nuoro', 'Oristano', 'Sassari', 'Sud Sardegna'],
  'Sicilia': ['Agrigento', 'Caltanissetta', 'Catania', 'Enna', 'Messina', 'Palermo', 'Ragusa', 'Siracusa', 'Trapani'],
  'Toscana': ['Arezzo', 'Firenze', 'Grosseto', 'Livorno', 'Lucca', 'Massa-Carrara', 'Pisa', 'Pistoia', 'Prato', 'Siena'],
  'Trentino-Alto Adige': ['Bolzano', 'Trento'],
  'Umbria': ['Perugia', 'Terni'],
  'Valle d\'Aosta': ['Aosta'],
  'Veneto': ['Belluno', 'Padova', 'Rovigo', 'Treviso', 'Venezia', 'Verona', 'Vicenza'],
};

export const LOCATIONS: Record<string, string[]> = {
  // Lombardia
  'Sondrio': ['Passo San Marco', 'Passo dello Stelvio', 'Passo del Gavia', 'Passo del Mortirolo', 'Aprica'],
  'Lecco': ['Varenna', 'Bellano', 'Piani d\'Erna', 'Colle di Balisio'],
  'Bergamo': ['Passo della Presolana', 'Passo San Marco (BG)', 'Selvino'],
  'Brescia': ['Passo del Tonale', 'Passo Crocedomini', 'Lago d\'Idro'],
  
  // Veneto
  'Verona': ['Lago di Garda', 'Peschiera del Garda', 'Malcesine', 'Passo Fittanze'],
  'Belluno': ['Cortina d\'Ampezzo', 'Passo Giau', 'Passo Rolle', 'Passo Falzarego', 'Passo Pordoi'],
  
  // Trentino
  'Trento': ['Passo del Manghen', 'Lago di Levico', 'Passo Sella'],
  'Bolzano': ['Passo Gardena', 'Passo Campolongo'],

  // Toscana
  'Firenze': ['Mugello', 'Passo della Futa', 'Passo della Raticosa'],
  'Massa-Carrara': ['Passo della Cisa'],
  'Arezzo': ['Passo dei Mandrioli', 'Passo dello Spino'],
  'Siena': ['Val d\'Orcia', 'Chiantigiana'],

  // Emilia
  'Piacenza': ['Passo del Penice', 'Val Trebbia'],
  'Parma': ['Passo del Tomarlo'],

  // Abruzzo
  'L\'Aquila': ['Campo Imperatore', 'Passo delle Capannelle', 'Passo Godi'],

  // Piemonte
  'Torino': ['Colle del Moncenisio', 'Colle delle Finestre'],
  'Cuneo': ['Colle della Maddalena', 'Colle dell\'Agnello'],
};

export const GENDERS = ['Maschio', 'Femmina', 'Altro', 'Preferisco non dirlo'];
export const RIDING_STYLES = ['Turistica', 'Sportiva', 'Off-road', 'Enduro', 'Cittadina'];
export const PREFERRED_TERRAINS = ['Tutte Curve', 'Off-Road', 'Litorale', 'Storico', 'Montagna'];
export const EXPERIENCE_LEVELS = ['Principiante', 'Intermedio', 'Esperto', 'Veterano'];

import heroLabImg from '../assets/images/hero_pitagora_lab_1794647252694.jpg';
import cityMapImg from '../assets/images/context_city_map_1794647252312.jpg';
import architectureImg from '../assets/images/context_architecture_clean_1794647274674.jpg';
import sportsScreenImg from '../assets/images/context_sports_screen_1794647253519.jpg';
import { ContextCategory } from '../types/game';

export const HERO_LAB_IMAGE = heroLabImg;

export const CONTEXT_IMAGES: Record<ContextCategory, { src: string; alt: string }> = {
  enunciato: {
    src: heroLabImg,
    alt: 'Banco di laboratorio geometrico con triangolo rettangolo e quadrati costruiti sui tre lati',
  },
  mappa: {
    src: cityMapImg,
    alt: 'Mappa cittadina illustrata con scuola, parco con sentieri diagonali, biblioteca e stazione',
  },
  architettura: {
    src: architectureImg,
    alt: 'Cortile scolastico con scala appoggiata alla parete in mattoni e rampa di accesso',
  },
  sport: {
    src: sportsScreenImg,
    alt: 'Campo da calcio visto dall’alto accanto a uno schermo widescreen per misurare le diagonali',
  },
};

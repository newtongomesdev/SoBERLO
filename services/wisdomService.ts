// Local collection of sobriety wisdom and tips (Offline-first)
export const getOfflineTip = (lang: string): string => {
  const tipsEn = [
    "One day at a time. Focus only on getting through today.",
    "Bravings are like waves; they peak and then they subside. Just ride it out.",
    "HALT: Never get too Hungry, Angry, Lonely, or Tired.",
    "Your future self will thank you for the choice you make right now.",
    "Sobriety doesn't give you a new life; it gives you your life back.",
    "Connection is the opposite of addiction.",
    "Progress, not perfection.",
    "You don't have to set the whole world on fire, just keep your own candle burning.",
    "Every craving is an opportunity to strengthen your 'no' muscle.",
    "Be kind to yourself. Recovery is a journey, not a race."
  ];

  const tipsPt = [
    "Um dia de cada vez. Concentre-se apenas em passar pelo dia de hoje.",
    "As fissuras são como ondas; elas atingem o pico e depois diminuem. Apenas espere passar.",
    "HALT: Nunca fique com muita Fome, Raiva, Solidão ou Cansaço.",
    "Seu 'eu' do futuro agradecerá pela escolha que você faz agora.",
    "A sobriedade não te dá uma vida nova; ela te devolve a sua vida.",
    "Conexão é o oposto do vício.",
    "Progresso, não perfeição.",
    "Você não precisa incendiar o mundo inteiro, apenas mantenha sua própria vela acesa.",
    "Cada fissura é uma oportunidade para fortalecer seu músculo do 'não'.",
    "Seja gentil consigo mesmo. A recuperação é uma jornada, não uma corrida."
  ];

  const tips = lang === 'pt' ? tipsPt : tipsEn;
  return tips[Math.floor(Math.random() * tips.length)];
};

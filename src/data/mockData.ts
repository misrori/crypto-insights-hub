import { VideoSummary } from '@/types/video';

export const mockVideos: Record<string, Record<string, VideoSummary[]>> = {
  '2026-02-06': {
    'CTOLARSSON': [
      {
        video_id: 'nJ7YN2OWoiw',
        title: 'You Don\'t Want to Regret This',
        published_at: '2026-02-06T10:24:07Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=nJ7YN2OWoiw',
        summary_hu: 'A videó egy vészhelyzeti frissítést kínál a Bitcoin piacról, hangsúlyozva a piaci volatilitást és a befektetési stratégiák fontosságát. A Bitcoin árfolyama 60 000 dollárról 50%-os csökkenést mutatott, ám a szerző úgy véli, hogy ez lehetőséget biztosít a nagyobb profitra a következő ciklus során.',
        summary_en: 'The video provides an emergency update on the Bitcoin market, highlighting volatility and the importance of investment strategies. Bitcoin\'s price has seen a 50% drop from 60,000 dollars, yet the author believes this presents an opportunity for greater profit in the next cycle.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 75,
        key_points_hu: [
          'A Bitcoin árfolyama 60 000 dollárról 50%-kal csökkent.',
          'A hosszú távú befektetési stratégiák, például technikai elemzés, elengedhetetlenek a piacon.',
          'Az alacsonyabb árak új lehetőségeket biztosítanak, a következő ciklusra pozitív kilátásokkal.'
        ],
        key_points_en: [
          'Bitcoin\'s price has dropped 50% from 60,000 dollars.',
          'Long-term investment strategies like technical analysis are essential in the market.',
          'Lower prices present new opportunities, with positive outlooks for the next cycle.'
        ],
        main_topics: ['Bitcoin Market Update', 'Investment Strategies']
      }
    ],
    'DataDispatch': [
      {
        video_id: 'VFJYb6uXFH0',
        title: 'Palantir Stock CRASHES As The Market TANKS Quickly!',
        published_at: '2026-02-06T03:59:32Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=VFJYb6uXFH0',
        summary_hu: 'A Palantir részvények zuhantak a piac gyors visszaesése közepette. Az elemzés a technológiai szektor általános gyengeségét tárgyalja és a befektetők számára lehetséges stratégiákat mutat be.',
        summary_en: 'Palantir stocks crashed amid rapid market decline. The analysis discusses the general weakness of the tech sector and presents possible strategies for investors.',
        crypto_sentiment: 'Bearish',
        sentiment_score: 25,
        key_points_hu: [
          'A Palantir részvények jelentősen estek.',
          'A technológiai szektor nyomás alatt van.',
          'A befektetőknek óvatosnak kell lenniük a jelenlegi piaci környezetben.'
        ],
        key_points_en: [
          'Palantir shares fell significantly.',
          'The tech sector is under pressure.',
          'Investors should be cautious in the current market environment.'
        ],
        main_topics: ['Stock Market', 'Palantir Analysis']
      }
    ],
    'DavidCarbutt': [
      {
        video_id: 'gFfQdEDxS10',
        title: 'Cathie Wood Drops JAW-DROPPING Prediction',
        published_at: '2026-02-06T12:01:18Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=gFfQdEDxS10',
        summary_hu: 'Cathie Wood lenyűgöző előrejelzést tett a Bitcoin jövőjéről. Az ARK Invest vezetője szerint a Bitcoin elérheti az 1 millió dolláros szintet a következő évtizedben.',
        summary_en: 'Cathie Wood made a jaw-dropping prediction about Bitcoin\'s future. The ARK Invest leader believes Bitcoin could reach $1 million level in the next decade.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 85,
        key_points_hu: [
          'Cathie Wood optimista a Bitcoin hosszú távú kilátásaival kapcsolatban.',
          'Az intézményi befektetések növekedni fognak.',
          'A decentralizált pénzügyek kulcsszerepet játszanak a jövőben.'
        ],
        key_points_en: [
          'Cathie Wood is optimistic about Bitcoin\'s long-term outlook.',
          'Institutional investments will continue to grow.',
          'Decentralized finance will play a key role in the future.'
        ],
        main_topics: ['Bitcoin Prediction', 'Institutional Investment']
      }
    ],
    'IvanOnTech': [
      {
        video_id: '-rdtLIy-Xa4',
        title: '10% Gold & Silver: Portfolio Insurance for Hyperinflation',
        published_at: '2026-02-06T18:59:28Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=-rdtLIy-Xa4',
        summary_hu: 'A hosszú távú portfólió 10%-os arányú nemesfém, arany és ezüst befektetése biztosítékot nyújt a hyperinfláció ellen. A befektető célja nemcsak a portfólió növelése, hanem a vagyon megőrzése is.',
        summary_en: 'Adding a 10% allocation of precious metals, specifically gold and silver, serves as insurance against hyperinflation. The investor aims not only to grow their portfolio but also to preserve wealth.',
        crypto_sentiment: 'Neutral',
        sentiment_score: 50,
        key_points_hu: [
          'A portfólió 10%-ának arany és ezüst biztosíték a hyperinfláció ellen.',
          'A vagyon megőrzése ugyanakkora fontosságú, mint a portfólió növelése.',
          'A globális konfliktusok esetén a vagyon áramlása aranyba és ezüstbe válhat.'
        ],
        key_points_en: [
          '10% allocation in gold and silver provides insurance against hyperinflation.',
          'Preserving wealth is as important as growing the portfolio.',
          'In global conflicts, wealth tends to flow into gold and silver.'
        ],
        main_topics: ['Precious Metals Investment', 'Economic Turmoil Insurance']
      },
      {
        video_id: '7tNyOKWtWw8',
        title: 'Bitcoin Buy Zone Hit: Historic Opportunity for Smart Investors',
        published_at: '2026-02-06T15:54:24Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=7tNyOKWtWw8',
        summary_hu: 'A Bitcoin elérte a vételi zónát, ami történelmi lehetőséget jelent az okos befektetők számára. Az elemzés technikai mutatókra épül és hosszú távú pozitív kilátásokat mutat.',
        summary_en: 'Bitcoin has hit the buy zone, presenting a historic opportunity for smart investors. The analysis is based on technical indicators and shows positive long-term outlook.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 80,
        key_points_hu: [
          'A Bitcoin elérte a kulcsfontosságú vételi zónát.',
          'A technikai elemzés pozitív jeleket mutat.',
          'Hosszú távú befektetési lehetőség.'
        ],
        key_points_en: [
          'Bitcoin has reached a key buy zone.',
          'Technical analysis shows positive signs.',
          'Long-term investment opportunity.'
        ],
        main_topics: ['Bitcoin Analysis', 'Trading Opportunity']
      }
    ],
    'coingecko': [
      {
        video_id: 'LMVOPY_B9Y0',
        title: 'State of Crypto Markets in 2026 | CoinGecko Virtual Meetup #33',
        published_at: '2026-02-06T02:36:52Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=LMVOPY_B9Y0',
        summary_hu: 'A CoinGecko virtuális találkozója áttekintést ad a 2026-os kriptopiac állapotáról. A beszélgetés kitér a piaci trendekre, az új technológiákra és a szabályozási környezetre.',
        summary_en: 'CoinGecko\'s virtual meetup provides an overview of the 2026 crypto market state. The discussion covers market trends, new technologies, and the regulatory environment.',
        crypto_sentiment: 'Neutral',
        sentiment_score: 55,
        key_points_hu: [
          'A kriptopiac jelentős változásokon megy keresztül.',
          'Az új technológiák átformálják az iparágat.',
          'A szabályozási környezet egyre tisztább képet mutat.'
        ],
        key_points_en: [
          'The crypto market is going through significant changes.',
          'New technologies are reshaping the industry.',
          'The regulatory environment is becoming clearer.'
        ],
        main_topics: ['Market Overview', 'Crypto Trends 2026']
      }
    ],
    'elliotrades_official': [
      {
        video_id: 'KH71ZhC2_VY',
        title: 'BITCOIN CRASH OVER? Urgent Crypto Market Update',
        published_at: '2026-02-06T23:37:06Z',
        sort_date: '2026-02-06',
        url: 'https://www.youtube.com/watch?v=KH71ZhC2_VY',
        summary_hu: 'Sürgős piaci frissítés a Bitcoin összeomlásáról. Az elemzés vizsgálja, hogy véget ért-e a medvepiac és milyen jeleket kell figyelni a következő napokban.',
        summary_en: 'Urgent market update on the Bitcoin crash. The analysis examines whether the bear market has ended and what signals to watch for in the coming days.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 70,
        key_points_hu: [
          'A Bitcoin stabilizálódni látszik a nagy esés után.',
          'Fontos támaszok tartják az árfolyamot.',
          'A következő napok kritikusak lesznek a trend szempontjából.'
        ],
        key_points_en: [
          'Bitcoin appears to be stabilizing after the major drop.',
          'Key support levels are holding the price.',
          'The next few days will be critical for the trend.'
        ],
        main_topics: ['Bitcoin Crash Analysis', 'Market Recovery']
      }
    ]
  },
  '2026-02-05': {
    'CTOLARSSON': [
      {
        video_id: 'abc123def',
        title: 'The Next Big Move in Bitcoin',
        published_at: '2026-02-05T14:30:00Z',
        sort_date: '2026-02-05',
        url: 'https://www.youtube.com/watch?v=abc123def',
        summary_hu: 'Elemzés a Bitcoin következő nagy mozgásáról. A technikai mutatók fontos fordulópontot jeleznek.',
        summary_en: 'Analysis of Bitcoin\'s next big move. Technical indicators signal an important turning point.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 72,
        key_points_hu: [
          'A technikai mutatók pozitív jeleket mutatnak.',
          'A volumen növekedik a támasz szinteknél.',
          'Hosszú távú trendforduló lehetséges.'
        ],
        key_points_en: [
          'Technical indicators show positive signals.',
          'Volume is increasing at support levels.',
          'A long-term trend reversal is possible.'
        ],
        main_topics: ['Bitcoin Technical Analysis', 'Market Trends']
      }
    ],
    'IvanOnTech': [
      {
        video_id: 'xyz789ghi',
        title: 'Ethereum 2.0: What You Need to Know',
        published_at: '2026-02-05T10:00:00Z',
        sort_date: '2026-02-05',
        url: 'https://www.youtube.com/watch?v=xyz789ghi',
        summary_hu: 'Minden, amit az Ethereum 2.0-ról tudni kell. Az új frissítések és azok hatása a hálózatra.',
        summary_en: 'Everything you need to know about Ethereum 2.0. New updates and their impact on the network.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 78,
        key_points_hu: [
          'Az Ethereum 2.0 jelentős teljesítményjavulást hoz.',
          'A staking egyre népszerűbb.',
          'A tranzakciós díjak csökkenni fognak.'
        ],
        key_points_en: [
          'Ethereum 2.0 brings significant performance improvements.',
          'Staking is becoming more popular.',
          'Transaction fees will decrease.'
        ],
        main_topics: ['Ethereum 2.0', 'Network Upgrades']
      }
    ]
  },
  '2026-02-04': {
    'elliotrades_official': [
      {
        video_id: 'jkl456mno',
        title: 'Altcoin Season is Coming: Top Picks',
        published_at: '2026-02-04T16:45:00Z',
        sort_date: '2026-02-04',
        url: 'https://www.youtube.com/watch?v=jkl456mno',
        summary_hu: 'Az altcoin szezon közeleg. A legjobb altcoinok kiválasztása a következő bullish periódusra.',
        summary_en: 'Altcoin season is approaching. Selecting the best altcoins for the next bullish period.',
        crypto_sentiment: 'Bullish',
        sentiment_score: 82,
        key_points_hu: [
          'Az altcoinok felülteljesíthetik a Bitcoint.',
          'DeFi projektek továbbra is vonzóak.',
          'A Layer 2 megoldások növekedni fognak.'
        ],
        key_points_en: [
          'Altcoins may outperform Bitcoin.',
          'DeFi projects remain attractive.',
          'Layer 2 solutions will continue to grow.'
        ],
        main_topics: ['Altcoin Season', 'Investment Strategy']
      }
    ],
    'coingecko': [
      {
        video_id: 'pqr012stu',
        title: 'Weekly Market Recap: Top Gainers and Losers',
        published_at: '2026-02-04T08:00:00Z',
        sort_date: '2026-02-04',
        url: 'https://www.youtube.com/watch?v=pqr012stu',
        summary_hu: 'Heti piaci összefoglaló a legnagyobb nyertesekről és vesztesekről a kriptópiacon.',
        summary_en: 'Weekly market recap of the biggest gainers and losers in the crypto market.',
        crypto_sentiment: 'Neutral',
        sentiment_score: 50,
        key_points_hu: [
          'A Bitcoin 5%-ot esett a héten.',
          'Több altcoin jelentős emelkedést mutatott.',
          'A DeFi TVL stabil maradt.'
        ],
        key_points_en: [
          'Bitcoin dropped 5% this week.',
          'Several altcoins showed significant gains.',
          'DeFi TVL remained stable.'
        ],
        main_topics: ['Market Recap', 'Weekly Analysis']
      }
    ]
  }
};

export const getAvailableDates = (): string[] => {
  return Object.keys(mockVideos).sort((a, b) => b.localeCompare(a));
};

export const getVideosByDate = (date: string): Record<string, VideoSummary[]> => {
  return mockVideos[date] || {};
};

export const getVideosByYouTuber = (youtuberId: string): Record<string, VideoSummary[]> => {
  const result: Record<string, VideoSummary[]> = {};
  
  Object.entries(mockVideos).forEach(([date, youtubers]) => {
    if (youtubers[youtuberId]) {
      result[date] = youtubers[youtuberId];
    }
  });
  
  return result;
};

export const getAllVideosForDate = (date: string): VideoSummary[] => {
  const videosByYouTuber = mockVideos[date] || {};
  return Object.values(videosByYouTuber).flat();
};

export type PlaceProperties = {
  name: string;
  location: [number, number];
  google_maps_url: string;
};

export const COFFEE_PLACES: {
  title: string;
  color: string;
  places: PlaceProperties[];
} = {
  title: 'Cafés',
  color: 'red',
  places: [
    {
      name: 'Café Lunático',
      location: [-43.231850046538334, -22.925945390979756],
      google_maps_url:
        'https://www.google.com/maps/place/Caf%C3%A9+Lun%C3%A1tico/@-22.9246711,-43.2348621,17.88z/data=!4m10!1m2!2m1!1zY2Fmw6k!3m6!1s0x997f1ce059b65f:0x7fa18d1ec9bc8173!8m2!3d-22.9259577!4d-43.2318608!15sCgVjYWbDqVoHIgVjYWbDqZIBC2NvZmZlZV9zaG9wmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVU50TVhKSWRVdDNFQUXgAQD6AQQIChA3!16s%2Fg%2F11r364xkc2?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Mais1 Café',
      location: [-43.23161461025416, -22.924922519961427],
      google_maps_url:
        'https://www.google.com/maps/place/Cafeteria+Mais1+Caf%C3%A9+-+Tijuca+-+Saens+Pe%C3%B1a/@-22.9246711,-43.2348621,17.88z/data=!4m10!1m2!2m1!1zY2Fmw6k!3m6!1s0x997f76a8c9ae4d:0x8a2454c8868e9430!8m2!3d-22.9249199!4d-43.2316152!15sCgVjYWbDqVoHIgVjYWbDqZIBC2NvZmZlZV9zaG9wmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVU53TVZCMlNWOUJSUkFC4AEA-gEECAAQQg!16s%2Fg%2F11sd9km_qj?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Darkcoffee Tijuca',
      location: [-43.23414430474974, -22.923934728487],
      google_maps_url:
        'https://www.google.com/maps/place/Darkcoffee+Tijuca/@-22.9246441,-43.2352307,17.88z/data=!4m10!1m2!2m1!1zY2Fmw6k!3m6!1s0x997fbc270c30e7:0x1ecb9fdda6b8d697!8m2!3d-22.9239338!4d-43.2341543!15sCgVjYWbDqVoHIgVjYWbDqZIBC2NvZmZlZV9zaG9wmgEjQ2haRFNVaE5NRzluUzBWSlEwRm5TVVJtZEdaTFkwdFJFQUXgAQD6AQQIABA9!16s%2Fg%2F11t76y2hbm?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Cheirin Bão Tijuca',
      location: [-43.23291585297723, -22.92340606709093],
      google_maps_url:
        'https://www.google.com/maps/place/Cheirin+B%C3%A3o+Tijuca/@-22.9246711,-43.2348621,17.88z/data=!3m1!5s0x997e6a5c0ee477:0xef5382e7aa380135!4m10!1m2!2m1!1zY2Fmw6k!3m6!1s0x997e4029e0f823:0xe03ca58c78df7e73!8m2!3d-22.9234008!4d-43.2329167!15sCgVjYWbDqVoHIgVjYWbDqZIBC2NvZmZlZV9zaG9wmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJHY0hReloybEJSUkFC4AEA-gEECEMQQg!16s%2Fg%2F11cs9m5y3r?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Afagá - Confeitaria Brasileira',
      location: [-43.2458290171617, -22.92505368636719],
      google_maps_url:
        'https://www.google.com/maps/place/Afag%C3%A1+-+Confeitaria+Brasileira/@-22.9250499,-43.2506999,17z/data=!3m2!4b1!5s0x997e0c467cf9f7:0x71c1508192b9bb34!4m6!3m5!1s0x997bbe6ec32e1f:0x8ee0cf0b0dd6631a!8m2!3d-22.92505!4d-43.245829!16s%2Fg%2F11f15nk_cg?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Coffee Five',
      location: [-43.176777008394744, -22.902568619852048],
      google_maps_url:
        'https://www.google.com/maps/place/Coffee+Five/@-22.9025663,-43.179354,17z/data=!3m2!4b1!5s0x997de0c6a1909d:0xd57c213cb2d631a3!4m6!3m5!1s0x997f8ed29c5785:0x2aba40f0def64!8m2!3d-22.9025663!4d-43.1767791!16s%2Fg%2F11p166fj7f?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Bóra Café',
      location: [-43.17507183772074, -22.90507319520636],
      google_maps_url:
        'https://www.google.com/maps/place/B%C3%B3ra+Caf%C3%A9/@-22.9050967,-43.1799418,17z/data=!3m1!4b1!4m6!3m5!1s0x997f76e992d32d:0x384703fad521914b!8m2!3d-22.9050968!4d-43.1750709!16s%2Fg%2F11w3dkw99_?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Bóra Café',
      location: [-43.17617459885609, -22.90444665236097],
      google_maps_url:
        'https://www.google.com/maps/place/B%C3%B3ra+Caf%C3%A9/@-22.9048818,-43.1763655,18.53z/data=!4m6!3m5!1s0x997f005e1c87db:0xf03ac0acfc79f00b!8m2!3d-22.9044385!4d-43.1761808!16s%2Fg%2F11yn_3g6w4?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
    {
      name: 'Starbucks',
      location: [-43.175574446972554, -22.90455464731465],
      google_maps_url:
        'https://www.google.com/maps/place/Starbucks/@-22.9044543,-43.1756392,19.87z/data=!3m1!5s0x9965e9bc8d947b:0x14c21926d9101834!4m6!3m5!1s0x997f5f9d7b7a3b:0x81bf8ab587e1da39!8m2!3d-22.9045566!4d-43.175582!16s%2Fg%2F11bwflr1j4?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },

    {
      name: 'Curto Café',
      location: [-43.17523984626672, -22.904229197299465],
      google_maps_url:
        'https://www.google.com/maps/place/Curto+Caf%C3%A9/@-22.9043042,-43.1754465,20.62z/data=!3m1!5s0x9965e9bc8d947b:0x14c21926d9101834!4m14!1m7!3m6!1s0x997f5f9d7b7a3b:0x81bf8ab587e1da39!2sStarbucks!8m2!3d-22.9045566!4d-43.175582!16s%2Fg%2F11bwflr1j4!3m5!1s0x997fc799613081:0xdfa60a0300403169!8m2!3d-22.9042305!4d-43.1752451!16s%2Fg%2F11grvn5qvs?entry=ttu&g_ep=EgoyMDI1MTEyMy4xIKXMDSoASAFQAw%3D%3D',
    },
  ],
};

export const TOBACCONIST_PLACES = {
  title: 'Tabacaria',
  color: 'gold',
  places: [],
};

export const CHOPP_PLACES = {
  title: 'Chopp',
  color: 'blue',
  places: [],
};

export const BOOKSTORES_PLACES = {
  title: 'Livrarias',
  color: 'green',
  places: [],
};

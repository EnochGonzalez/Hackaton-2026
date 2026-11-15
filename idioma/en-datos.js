/* ============================================================
   INGLÉS · Datos del juego, organizados por id.
   Al agregar una pieza, misión o evento en datos/, agrega aquí su
   traducción con el mismo id (npm test avisa si falta alguna).
   ============================================================ */
export const EN_DATOS = {

  // ---------- Piezas del satélite (datos/piezas.js) ----------
  piezas: {
    // Chasis
    cube:     {n:'CubeSat 6U / 12U Bus', txt:'Very cheap and light. Holds only one miniature instrument in low orbit. Missions: FireSat, TROPICS, PREFIRE.'},
    micro:    {n:'BCP-100 Microsatellite Bus', txt:'Up to 2 light instruments. Ideal for small budgets. Missions: CYGNSS, GPIM.'},
    ls2:      {n:'LEOStar-2 Standard Bus', txt:'Two medium instruments. A proven, affordable structure for polar orbit. Missions: EO-1, OCO-2.'},
    ls3:      {n:'LEOStar-3 Advanced Bus', txt:'Up to 3 large instruments. Supports heavy cameras and lidars. Missions: Landsat 8 and 9, ICESat-2, Suomi NPP.'},
    gsfc:     {n:'NASA GSFC Modular Bus', txt:'Three instruments, supports radar and deployable antennas. Missions: PACE, GPM, NISAR.'},
    a2100:    {n:'A2100 Geostationary Bus', txt:'Four heavy instruments and full redundancy for 15 years in GEO. Missions: GOES-16 to GOES-19.'},
    explorer: {n:'Explorer Astronomy Bus', txt:'One camera package. An exoplanet hunter for a fraction of the cost of a large observatory. Mission: TESS.'},
    hubble:   {n:'Rigid Observatory Bus (Hubble / Roman)', txt:'A rigid cylinder that protects a 2.4 m mirror with no folds. Missions: Hubble, Nancy Grace Roman.'},
    jwst:     {n:'Cryogenic Graphite Bus (JWST)', txt:'A composite that does not warp at -233 °C. Launches folded: needs the extra-long fairing. Mission: James Webb.'},
    // Energía
    e60:   {n:'CubeSat panels (60 W)', txt:'Only powers a CubeSat with a compact camera and a low-power radio.'},
    e430:  {n:'Small double wing (430 W)', txt:'Enough for the 4 TESS cameras or a light satellite.'},
    e1000: {n:'Body-mounted panels (1,000 W)', txt:'Fixed to the bus with no hinges: they cannot fail to deploy. They raise reliability.'},
    e1500: {n:'Articulated solar wing (1,500 W)', txt:'The Eye on Earth standard: it turns to follow the Sun and rides out 35-minute eclipses. Landsat 9, ICESat-2, PACE.'},
    e2000: {n:'Tail-Dragger solar wing (2,000 W)', txt:'A 6 m wing at the tail of the observatory. There are no eclipses at L2: 2,000 W continuous, with no vibration. James Webb.'},
    e2400: {n:'Symmetric double panels (2,400 W)', txt:'Two deployable wings. They power the KaRIn radar or a telescope in low orbit. Hubble, SWOT.'},
    e4000: {n:'High-power double wing (4,000 W)', txt:'Required for the SAR radar (2,100 W) or for geostationary satellites with several instruments. NISAR, GOES-R.'},
    // Sensores · Ojo en la Tierra
    fire:     {n:'Compact thermal infrared camera (FireSat)', txt:'Detects hot spots in 40 km swaths from a CubeSat. Thick clouds block it.'},
    hyperion: {n:'Hyperion hyperspectral imager (EO-1)', txt:'220 bands at 30 m resolution. Detects water stress in trees before a fire. Has its own built-in cooler.'},
    airs:     {n:'AIRS / CrIS atmospheric infrared sounder', txt:'Measures temperature, humidity, carbon monoxide from fires, methane and CO2 in 3D.'},
    modis:    {n:'MODIS spectroradiometer (Terra / Aqua)', txt:'36 bands and a 2,330 km swath. Maps every active fire on the planet every 24 to 48 hours.'},
    viirs:    {n:'VIIRS multispectral radiometer (Suomi NPP)', txt:'22 bands and a gap-free 3,060 km swath. Images smoke and fires in the middle of the night.'},
    oci:      {n:'OCI ocean color instrument (PACE)', txt:'From ultraviolet to infrared: measures marine phytoplankton and smoke aerosols.'},
    karin:    {n:'KaRIn radar interferometer (SWOT)', txt:'Deploys a 10 m mast to measure water height in rivers, reservoirs and oceans. Needs a fast antenna.'},
    atlas:    {n:'ATLAS laser altimeter (ICESat-2)', txt:'10,000 laser pulses per second to measure glacier melt and forest biomass.'},
    abi:      {n:'ABI geostationary imager (GOES-R)', txt:'Needs GEO orbit. Images the continent every 5 minutes and fire zones every 30 seconds.'},
    oli:      {n:'OLI-2 + TIRS-2 cameras (Landsat 9)', txt:'15 to 30 m per pixel in visible and thermal infrared: deforestation, drought and water use. Needs a cryocooler.'},
    sar:      {n:'Synthetic aperture radar SAR (NISAR)', txt:'Sees through clouds, rain and smoke: floods, landslides and earthquakes, day and night. Very heavy and power-hungry.'},
    // Sensores · Telescopio Espacial
    tess:   {n:'4 wide-field CCD cameras (TESS)', txt:'Watches 200,000 bright stars for dips in light when an exoplanet passes in front of its star.'},
    kepler: {n:'95-megapixel stellar photometer (Kepler)', txt:'A 1.4 m mirror that watches 150,000 stars to find rocky, Earth-sized planets.'},
    wfc3:   {n:'2.4 m rigid mirror + visible/UV cameras (Hubble)', txt:'Galaxies, nebulae and planets in visible and ultraviolet light. Does not need extreme cryogenics.'},
    roman:  {n:'2.4 m rigid mirror + WFI infrared camera (Roman)', txt:'A field of view 100 times larger than Hubble in the near infrared, with a coronagraph to image exoplanets.'},
    nircam: {n:'6.5 m origami mirror + NIRCam / NIRSpec (James Webb)', txt:'18 folding beryllium and gold hexagons. Sees the first stars after the Big Bang. Needs the sunshield and the extra-long fairing; deployment lowers reliability.'},
    miri:   {n:'MIRI mid-infrared instrument (James Webb)', txt:'Sees through the dust clouds where solar systems are born. Goes completely blind without the helium cryocooler.'},
    // Soporte térmico
    mli:      {n:'MLI blankets + heaters', txt:'Keeps 270 to 300 K. Enough for simple optical cameras, lidars and radars.'},
    rad:      {n:'Passive radiators + heat pipes', txt:'Cools down to 80 K with no moving parts. Standard for VIIRS, MODIS, OCI, AIRS, TESS and Roman.'},
    loop:     {n:'Active fluid loop (NISAR)', txt:'Required with the SAR radar: without it, the radar electronics melt from their own heat.'},
    stirling: {n:'Single-stage Stirling cryocooler', txt:'Cools to 40 to 60 K. Required for the TIRS-2 (Landsat 9) and ABI (GOES-R) cameras.'},
    sun:      {n:'5-layer deployable sunshield (JWST)', txt:'Cools from +85 °C to -233 °C. Only works at L2, where the Sun, Earth and Moon are on the same side. Its deployment lowers reliability.'},
    helio:    {n:'Closed-cycle helium cryocooler (MIRI)', txt:'Pumps ultra-cold helium down to 6.7 K, close to absolute zero. Required for MIRI.'},
    // Apuntamiento
    mag:      {n:'Magnetorquers + sun sensors', txt:'Uses Earth\'s magnetic field. Low precision (±0.5° to ±2°).'},
    nadir:    {n:'Standard nadir ADCS (3 wheels)', txt:'Keeps the climate cameras always pointing at the ground (±0.01°).'},
    nadirP:   {n:'Ultra-precise nadir ADCS (laser + dual GPS)', txt:'Required for ATLAS, KaRIn and Landsat 9: without it, the lasers or the 15 m pixels miss their target.'},
    geoA:     {n:'Geostationary ADCS with isolation', txt:'Points at a fire a few kilometers wide from 35,786 km without the wheels shaking the image.'},
    inercial: {n:'Inertial pointing (star trackers + 4 wheels)', txt:'Instead of looking at Earth, it keeps the telescope locked on a constellation for weeks. TESS, Kepler.'},
    fgs:      {n:'Fine Guidance Sensor + 6 isolated wheels', txt:'One millionth of a degree. Required for 2.4 m and 6.5 m mirrors: without it, galaxies come out blurry.'},
    // Comunicaciones
    uhf:   {n:'UHF / S-band patch antenna', txt:'Up to 15 Mbps. Only enough for the compact camera or the AIRS sounder.'},
    kaC:   {n:'Short-range Ka-band antenna (TESS)', txt:'100 Mbps to download data when the telescope passes close to Earth.'},
    x:     {n:'X-band transmitter + 704 Gbit recorder', txt:'300 Mbps. The standard for NASA polar satellites.'},
    xka:   {n:'X/Ka-band + 2.3 TB recorder', txt:'600 Mbps. Required for Landsat 9, KaRIn and SAR, which generate terabits every day.'},
    dsn:   {n:'Deep-space dish antenna (Ka)', txt:'Reaches the Deep Space Network from 1.5 million km away. Low-orbit antennas do not have that power.'},
    laser: {n:'Laser optical terminal (LCRD)', txt:'1,200 Mbps with a laser beam: half the mass of a dish. New technology: lowers reliability a little.'},
    // Propulsión
    gas:     {n:'Cold gas thruster', txt:'Safe, cheap and non-toxic. Keeps a CubeSat in orbit for 1 to 2 years.'},
    hidra:   {n:'Hydrazine monopropellant', txt:'NASA\'s most used in low orbit: holds altitude for 7 to 10 years and dodges space debris.'},
    hall:    {n:'Hall-effect ion thruster', txt:'6 times more efficient than hydrazine: saves almost 100 kg. Needs solar panels of at least 1,350 W.'},
    bimodal: {n:'Bimodal thrusters for L2', txt:'Required at L2: the orbit is unstable and the engines must fire every 21 days to stay in it.'},
    apogeo:  {n:'Bipropellant apogee engine', txt:'Required in GEO: the rocket leaves you in an elliptical orbit and this engine circularizes it at 35,786 km. Doubles the mass.'},
  },

  pruebas: {
    none:  {n:'No extra tests', txt:'You spend no months and no money.'},
    basic: {n:'Basic tests', txt:'Essential vibration and thermal tests.'},
    full:  {n:'Full tests', txt:'Thermal vacuum and vibration: the way to get past 90% reliability.'},
  },

  pasos: {
    bus:      {n:'BUS', ayuda:'Choose the bus and the power source.'},
    sensores: {n:'SENSORS', ayuda:'Choose the science instruments. The bus limits how many fit.'},
    soporte:  {n:'SUPPORT', ayuda:'Thermal control (you can combine several), pointing, communications and propulsion.'},
    cohete:   {n:'ROCKET', ayuda:'Build the rocket part by part, from the bottom up.'},
  },

  nombreCat: {chasis:'Bus', energia:'Power', instr:'Instruments', termico:'Thermal control', adcs:'Pointing', comms:'Communications', prop:'Propulsion',
    f1:'Stage 1 · Main body', boosters:'Side boosters', etapa:'Stage 2 · Upper stage', cofia:'Top · Fairing'},

  // ---------- Cohete (datos/cohete.js) ----------
  cohete: {
    electron: {n:'Rocket Lab Electron body', txt:'9 Rutherford engines. The cheapest and fastest, only for CubeSats. CAPSTONE, PREFIRE, TROPICS.'},
    minotaur: {n:'Minotaur IV solid body', txt:'Three solid-fuel stages. No cryogenic tanks: ready in a few months. For microsatellites.'},
    delta2:   {n:'Delta II 7000 body', txt:'The classic Eye on Earth rocket: it launched Terra, Aqua, Suomi NPP and ICESat-2. Gains capacity with GEM-40 boosters.'},
    falcon9:  {n:'Falcon 9 Block 5 body', txt:'9 Merlin engines, reusable. The best cost per kilogram. With 2 side cores it becomes a Falcon Heavy.'},
    atlas:    {n:'Atlas V / Vulcan body', txt:'Lets you tune thrust with 0, 2 or 4 solid boosters. Landsat 8 and 9, GOES-16/17/18.'},
    ariane:   {n:'Ariane 5 core body', txt:'Specialized in wide payloads to high orbits and L2. Cannot lift off without its 2 giant boosters. James Webb.'},
    delta4:   {n:'Delta IV cryogenic body', txt:'Liquid hydrogen. For heavy GEO and deep-space missions. GOES-N/O/P, Parker Solar Probe.'},
    none: {n:'No boosters', txt:'The base capacity of Stage 1. Landsat 9, SWOT and PACE launched like this.'},
    gem3: {n:'3 × GEM-40', txt:'Solid boosters for Delta II (7320). Used by OCO-2.'},
    gem4: {n:'4 × GEM-40', txt:'Solid boosters for Delta II (7420). Used by ICESat-2.'},
    gem9: {n:'9 × GEM-40', txt:'Solid boosters for Delta II (7920). Used by Suomi NPP and Aqua.'},
    aj2:  {n:'2 × AJ-60A', txt:'Solid boosters for Atlas V. They raise capacity to GEO.'},
    aj4:  {n:'4 × AJ-60A', txt:'Atlas V 541 configuration: the one that took the GOES satellites to geostationary orbit.'},
    eap2: {n:'2 × EAP P241', txt:'The giant Ariane 5 boosters: they provide 90% of liftoff thrust. Required.'},
    fh2:  {n:'2 × Falcon Heavy cores', txt:'Two Falcon 9 cores on the sides. Launched GOES-19 and will launch Roman.'},
    cbc2: {n:'2 × CBC cores', txt:'Delta IV Heavy configuration. Launched Parker Solar Probe.'},
    curie:   {n:'Curie / Photon', txt:'Electron\'s upper stage. Places CubeSats in their exact orbit.'},
    orion:   {n:'Orion 38 solid stage', txt:'A simple, affordable solid stage for small satellites.'},
    deltak:  {n:'Delta-K hypergolic', txt:'Storable fuel that can restart several times in polar orbit.'},
    merlin:  {n:'Merlin 1D Vacuum', txt:'Very high thrust and low cost. SWOT, PACE, TESS.'},
    centaur: {n:'Cryogenic Centaur', txt:'Top injection precision thanks to its RL10 engine.'},
    esca:    {n:'Cryogenic ESC-A', txt:'Its L2 injection was so accurate that it doubled the James Webb\'s lifetime.'},
    dcss:    {n:'DCSS / ICPS', txt:'The highest chemical specific impulse in service.'},
    c12:  {n:'Compact 1.2 m fairing', txt:'Only fits CubeSats or compact microsatellites.'},
    c20:  {n:'Light 2.0 m fairing', txt:'For microsatellites and small buses.'},
    c30:  {n:'Composite 3.0 m fairing', txt:'For medium satellites with one large instrument. ICESat-2, OCO-2.'},
    c40:  {n:'Standard 4.0 m fairing', txt:'Standard for medium and heavy platforms. Landsat 8 and 9, Terra.'},
    c54:  {n:'Wide 5.4 m fairing', txt:'For radars with deployable antennas, geostationary satellites and rigid telescopes.'},
    c54L: {n:'Giant 5.4 × 17 m fairing', txt:'The only one tall enough for the folded James Webb and its sunshield.'},
  },

  // ---------- Misiones (datos/misiones.js) ----------
  orb: {sso:'Sun-synchronous (SSO · 705 km)', leo:'Low Earth orbit (LEO · 540 km)', geo:'Geostationary (GEO · 35,786 km)', l2:'Lagrange point L2 (1.5 million km)'},

  categorias: {
    ojo: {n:'Eye on Earth', txt:'Earth observation satellites inspired by NASA\'s EOS system.'},
    tel: {n:'Space Telescope', txt:'Observatories inspired by TESS, Hubble, Roman and James Webb.'},
  },

  misiones: {
    o0: {n:'Your first CubeSat',
      ctx:'A group of firefighters wants to see wildfires from space, but has little money. You will build a small satellite step by step. We will tell you what to choose and why.',
      goal:'Detect hot spots with a small satellite.',
      needTxt:'The contract asks for at least one instrument that detects hot spots.',
      real:'The FireSat and Intuition-1 CubeSats.'},
    t0: {n:'Your first telescope',
      ctx:'You want to find planets around other stars. You will build a light telescope in low orbit, step by step. We will tell you what to choose and why.',
      goal:'Search for exoplanets with a light telescope.',
      needTxt:'The contract asks for at least one astronomical instrument.',
      real:'TESS, NASA\'s exoplanet hunter (2018).'},
    o1: {n:'Rapid wildfire alert',
      ctx:'North American wildfires spread in hours. A firefighting consortium wants a tiny CubeSat-type satellite that detects hot spots from an orbit that passes over the same area every day. You have little money: every gram and every dollar counts.',
      goal:'Detect hot spots with a small, cheap satellite.',
      needTxt:'The contract asks for at least one instrument that detects hot spots.',
      real:'The FireSat and Intuition-1 CubeSats, and NASA\'s EOS network.'},
    o2: {n:'Continental health map',
      ctx:'An agriculture and environment agency needs to see how crops, forests, water and droughts change across North America, every day, under the same light. You need several instruments working together, kept at their temperature, and an antenna that downloads all that data without getting saturated.',
      goal:'Observe the continent with at least two instruments.',
      needTxt:'The contract asks for at least two instruments.',
      real:'Suomi NPP, Landsat 9, PACE and SWOT.'},
    o3: {n:'Geostationary watchtower',
      ctx:'A polar satellite only sees a fire when it passes overhead. To watch 24 hours a day, the government wants a satellite that stays still over the continent, almost 36,000 km up. It is far: the rocket leaves you halfway, so you need an apogee engine that doubles your mass and a rocket with boosters.',
      goal:'Watch the continent around the clock with an early-warning instrument.',
      needTxt:'The contract asks for the ABI geostationary imager.',
      real:'GOES-16 to GOES-19, the NOAA and NASA weather satellites.'},
    t1: {n:'Window to the nearby universe',
      ctx:'You want a telescope in Earth orbit, free from the atmosphere that distorts light. You can go for a light, cheap exoplanet hunter, or for an observatory with a 2.4 m mirror that images galaxies in visible and ultraviolet light. More science costs more money and demands much finer pointing.',
      goal:'Observe exoplanets or galaxies from Earth orbit.',
      needTxt:'The contract asks for at least one astronomical instrument.',
      real:'TESS (2018), Kepler and the Hubble Space Telescope (1990).'},
    t2: {n:'First stars in infrared',
      ctx:'Light from the first galaxies arrives stretched into the infrared. To see it you need very cold instruments, so you must go to L2, a point 1.5 million km away where the Earth, the Moon and the Sun stay on the same side. Nobody can repair you there, normal antennas do not reach, and the orbit is unstable.',
      goal:'Detect infrared light from distant galaxies at L2.',
      needTxt:'The contract asks for at least one infrared instrument.',
      real:'The Nancy Grace Roman telescope and James Webb.'},
    t3: {n:'Next-generation observatory',
      ctx:'The ultimate challenge: a 6.5 m mirror that folds like origami, a five-layer sunshield, a helium cryocooler and several cryogenic instruments. Every decision pushes the limits of mass, power and reliability, and only an extra-long fairing can carry it.',
      goal:'Explore the early universe with the greatest possible science power.',
      needTxt:'The contract asks for the 6.5 m origami mirror and at least two instruments.',
      real:'The James Webb Space Telescope (JWST), launched in December 2021.'},
  },

  // ---------- Dificultades (datos/dificultades.js) ----------
  dif: {
    cad: {n:'Rookie', txt:'Generous budget and deadline, fewer surprises. To learn how the parts connect.'},
    ing: {n:'Skilled', txt:'The contract exactly as the agency asks for it.'},
    dir: {n:'Expert', txt:'Tight budget and deadline, more risk at launch and during events, and higher science targets. You have to use every resource precisely.'},
  },

  // ---------- Eventos (datos/eventos.js) ----------
  // o: [nombre, descripción, pista, mensaje si sale mal]
  eventos: {
    storm: {t:'Solar storm', q:'A coronal mass ejection is approaching. The electronics are at risk.', o:[
      ['Shut down the instruments for two weeks', 'Spacecraft safe, you lose science.', 'This is the safe option: it does not risk the spacecraft.'],
      ['Keep everything on', '40% risk of damage.', 'You keep the science, but the electronics are exposed.', 'The storm damaged the electronics.'],
      ['Reorient the spacecraft', 'Costs budget and some science.', 'Reduces exposure without shutting everything down.']]},
    comms: {t:'Main antenna failure', q:'The main antenna stops responding.', o:[
      ['Use the backup antenna', 'Lower data rate this month.', 'You lose a little science, but you risk nothing.'],
      ['Reboot the system', '50% chance of returning to normal.', 'If it fails, you lose the whole month of data.', 'The reboot failed and a month of data was lost.'],
      ['Accept the lower rate', 'No cost, you lose data.', 'Free, but you sacrifice part of the science.']]},
    fire: {t:'Wildfire in North America', q:'A large fire is reported inside your contract area.', o:[
      ['Priority observation', 'More science, more wear.', 'It is exactly what the contract asks for: science goes up.'],
      ['Stick to the plan', 'No changes.', 'You neither gain nor lose anything.'],
      ['Ask another mission for support', 'Costs budget.', 'Adds science without wearing out your spacecraft.']]},
    degr: {t:'An instrument is degrading', q:'One of your instruments starts giving noisy readings.', o:[
      ['Recalibrate', 'Costs budget.', 'Fixes the problem with little loss.'],
      ['Turn it off for a month', 'You lose its science this month.', 'Safe, but you lose science.'],
      ['Ignore it', '50% chance of getting worse.', 'Free, but the degradation may grow.', 'The instrument got worse and damaged other systems.']]},
    micro: {t:'Micrometeoroid impact', q:'An impact hits the primary mirror.', o:[
      ['Recalibrate the actuators', 'You lose a few days of observation.', 'Realigning the segments restores image quality.'],
      ['Keep observing', 'Somewhat blurry images.', 'You lose no time, but the mirror stays misaligned.', 'The misaligned mirror degraded the images.'],
      ['Shut down and assess', 'Safe, you lose almost a month.', 'Maximum safety, maximum loss of science.']]},
    cryo: {t:'The cryocooler is heating up', q:'The mid-infrared cooler is drawing more power than normal.', o:[
      ['Turn off the mid-infrared for a month', 'You lose its science.', 'Prevents the instruments from overheating.'],
      ['Keep it on', '40% risk of thermal blinding.', 'If the instrument heats up, it only picks up noise.', 'The instrument heated up and went blind.'],
      ['Reduce activity', 'Costs budget and some science.', 'A middle ground between risk and science.']]},
    merge: {t:'Opportunity: galaxy merger', q:'A galaxy collision, like Stephan\'s Quintet, has been detected and is observable for only a few weeks.', o:[
      ['Observe it right away', 'Lots of science, more wear.', 'It is a unique opportunity: science goes up.'],
      ['Stick to the schedule', 'No changes.', 'Nothing changes.'],
      ['Observe it with reduced time', 'Moderate science.', 'Gains something without changing the plan.']]},
  },

  // ---------- Glosario (datos/glosario.js), misma estructura que en español ----------
  glosario: [
    ['Mission engineering', [
      ['chasis', 'Bus', 'The spacecraft structure. It sets the base mass and how many instruments fit (slots).'],
      ['energia', 'Power (W)', 'The energy the solar panels generate versus what the parts consume. If you use more than you generate, the spacecraft shuts down.'],
      ['comms', 'Bandwidth (Mbps)', 'How fast the antenna sends data to Earth. If the instruments generate more than the antenna sends, science is lost.'],
      ['rocket', 'Rocket capacity', 'The maximum mass a rocket carries to a given orbit. It changes with the contract orbit.'],
      ['tests', 'Reliability', 'The probability that the spacecraft works. Ground tests raise it, but they cost time and money.'],
      ['prop', 'Delta-V and propulsion', 'The total "push" the spacecraft can give itself to correct its path. Needed to reach GEO and to stay at L2.'],
      ['adcs', 'ADCS (pointing)', 'The system that orients the spacecraft: reaction wheels, sensors and magnetorquers.'],
      ['termico', 'MLI', 'Multi-layer blankets that insulate the spacecraft from the heat and cold of space.'],
      ['cofia', 'Fairing', 'The cover at the tip of the rocket that protects the payload. Its diameter limits the size of the satellite that fits.'],
      ['f1', 'Stage 1', 'The main body of the rocket: it beats gravity in the first minutes of launch.'],
      ['boosters', 'Boosters', 'Auxiliary rockets on the sides of Stage 1. They give extra thrust for heavy payloads or distant orbits.'],
      ['etapa', 'Upper stage (Stage 2)', 'The engine that fires in vacuum to leave the satellite in its final orbit.'],
      ['chasis', 'M USD', 'Millions of US dollars: the budget unit.']]],
    ['Orbits, instruments and missions', [
      ['orbita', 'SSO (sun-synchronous)', 'A low orbit that passes over each point at the same local time. Gives daily global coverage.'],
      ['orbita', 'LEO', 'Low Earth orbit, about 540 km up. Hubble orbits there.'],
      ['orbita', 'GEO (geostationary)', 'At 35,786 km, the satellite stays fixed over one point and watches the same hemisphere 24 hours a day.'],
      ['orbita', 'L2 (Lagrange point)', 'A point 1.5 million km from Earth, on the side opposite the Sun. James Webb orbits there.'],
      ['instr', 'VIIRS', 'The Suomi NPP radiometer: 22 visible and infrared bands for fires, smoke and sea temperature.'],
      ['instr', 'ABI', 'The GOES-R imager, a geostationary satellite that scans the continent every 5 minutes.'],
      ['sar', 'SAR (synthetic aperture radar)', 'A radar that sees through clouds and smoke. It uses a lot of power and generates a lot of data.'],
      ['instr', 'Hyperspectral', 'A camera that sees hundreds of fine colors to tell apart crops, drought or fire.'],
      ['espejo', 'Segmented mirror', 'A mirror made of hexagons that fold to fit in the rocket and open in space.'],
      ['sun', 'Sunshield and cryocooler', 'Sunshield: blocks the heat of the Sun and Earth. Cryocooler: cools infrared instruments to a few degrees above absolute zero.'],
      ['instr', 'NIRCam / NIRSpec / MIRI', 'The James Webb infrared instruments: camera, spectrograph and mid-infrared camera.'],
      ['chasis', 'EOS', 'NASA\'s Earth Observing System: a network of more than 20 satellites that watches the planet.']]],
  ],
};

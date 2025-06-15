import axios from 'axios';

let HOSPITAL_URL = '';

export const initHospitalUrl = async () => {
  try {
    const catalog = await axios.get('https://data.cms.gov/data.json');

    const set = catalog.data.dataset.find(d =>
      d.title.toLowerCase().includes('hospital enrollments')
    );

    if (!set) {
      console.error('Hospital enrollments dataset not found');
      return;
    }

    const distro = set.distribution.find(d =>
      d.format === 'API' && d.description === 'latest'
    );

    if (!distro) {
      console.error('API distribution not found');
      return;
    }

    HOSPITAL_URL = distro.accessURL;
    // console.log('✅ HOSPITAL_URL:', HOSPITAL_URL);
  } catch (err) {
    console.error('initHospitalUrl error:', err.message);
  }
};

export const getHospitalsZipAndName = async (req, res) => {
  const { zip, name } = req.query;
  if (!HOSPITAL_URL) return res.status(503).json({ error: 'CMS API not ready' });

  try {
    const response = await axios.get(HOSPITAL_URL);
    const filtered = response.data
      .filter(item => {
        const zipMatch = zip ? item["ZIP CODE"] === zip : true;
        const nameMatch = name
          ? item["ORGANIZATION NAME"]?.toLowerCase().includes(name.toLowerCase())
          : true;
        return zipMatch && nameMatch;
      })
      .map(item => ({
        zip: item["ZIP CODE"],
        name: item["ORGANIZATION NAME"]
      }));

    res.status(200).json(filtered);
  } catch (err) {
    console.error('Hospital data error:', err.message);
    res.status(500).json({ error: 'Failed to fetch hospital data' });
  }
};


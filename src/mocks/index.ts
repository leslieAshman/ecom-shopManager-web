import moment from 'moment';

export const mockQShopModel = () => {
  return {
    shopId: '',
    logo: { name: 'test', image: '' },
    logoSmall: '',
    name: '',
    address: '',
    area: '',
    postcode: '',
    city: '',
    country: '',
    email: '',
    phoneNo: '',
    createdBy: '',
    createdDate: moment().format('YYYY-MM-DD HH:mm:ss'),
    isAgreementSigned: false,
    owner: '',
    ownerPic: '',
    website: '',
    hashTags: [],
    isOnline: false,
    likes: 0,
    reviews: [],
    gallery: [],
    serviceBin: [],
    currency: {
      symbol: '',
      short: '',
      long: '',
    },

    bookings: [],
    employees: [],
  };
};

export const mockCreateShopRequest = {
  logo: { createdDate: 'Mon Nov 07 2022', pic: '' },
  name: 'Class by Toya',
  address: '61958 Molines Road',
  city: 'Kingston',
  area: 'Jeanburgh',
  country: 'Jamaica',
  owner: 'Toya Kelly',
  website: 'https://woeful-station-wagon.com',
  email: 'Losera@623.com',
  phoneNo: '(838) 445-3267 x3887',
  isAgreementSigned: true,
};

export const DATA_USER = 'dataUserTransport';
export const TOKEN = 'tokenTransport';

export const validateMessages = {
  required: "${label} bắt buộc!",
  types: {
    email: "${label} không phải định dạng của email!",
    number: "${label} không phải định dạng của số!",
  },
  number: {
    range: "${label} phải từ ${min} đến ${max}",
  },
};

export const LINK_DIRECTORY_FILES = "http://localhost:5001/photo/";
export const LINK_UPLOAD_PHOTO = "http://localhost:5001/uploadphoto";

// export const ROLE_ADMIN = 'admin';
export const ROLE_CASHIER = 'cashier';
export const ROLE_CUSTOMER = 'customer';
export const ROLE_INVENTORY_MANAGER = 'inventoryManager';

export const TABLE_STATUS_BUSY = 'busy';
export const TABLE_STATUS_FREE = 'free';
export const TABLE_STATUS_BOOKED = 'booked';


export const GENDER_MALE = 'male';
export const GENDER_FEMALE = 'female';
export const GENDER_SECRET = 'secret';

export const ROLE_SUPERADMIN = 'superadmin';
export const ROLE_ADMIN = 'admin';
export const ROLE_EMPLOYEE = 'employee';
export const LOCAL_LANGUAGE = '_locale_langage_BLicko'
export const SUPPORTED_LOCALES = ["fr", "en"]


export const FORM_TYPE_NEW = 'new';
export const FORM_TYPE_EDIT = 'edit';

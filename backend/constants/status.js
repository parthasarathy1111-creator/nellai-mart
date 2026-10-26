'use strict';

const SHOP_STATUS = Object.freeze({
  ACTIVE: 'Active',
  PENDING: 'Pending Verification',
  SUSPENDED: 'Suspended',
});

const SHOP_STATUS_VALUES = Object.values(SHOP_STATUS);

const ACTIVITY_ENTITIES = Object.freeze({
  ADMIN: 'Admin',
  CATEGORY: 'Category',
  PRODUCT: 'Product',
  SHOP: 'Shop',
  SHOP_PRODUCT: 'ShopProduct',
  SETTING: 'Setting',
});


const ACTIVITY_ENTITY_VALUES = Object.values(ACTIVITY_ENTITIES);

module.exports = {
  SHOP_STATUS,
  SHOP_STATUS_VALUES,
  ACTIVITY_ENTITIES,
  ACTIVITY_ENTITY_VALUES,
};

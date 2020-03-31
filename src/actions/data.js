import { ACTION_TYPE_UPDATE_DATA } from 'config';

export function updateData(payload) {
  return {
    type: ACTION_TYPE_UPDATE_DATA,
    payload,
  };
}

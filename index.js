let store = {};
let subscribers = {}

const nameWarning = (value, nameType) => {
  if (typeof value !== 'string') {
    console.warn(`${value} is not a valid ${nameType}`);
    return;
  }
}

const subscriptions = stateName => {
  if (subscribers[stateName] === undefined) {
    return;
  }
  Object.entries(subscribers[stateName]).forEach(([ref, callback]) => {
    // stateName, value, ref
    const value = state.get(stateName);
    const parsed = () => JSON.parse(value);
    callback({
      stateName,
      value,
      parsed,
      ref
    })
  });
}


const state = {
  get(stateName, parse) {
    nameWarning(stateName);
    const value = store[stateName];
    return parse ? JSON.parse(value) : value;
  },
  /**
   * 
   * @param {string} stateName        - The name of the state to set
   * @param {*} value                 - The value of the state to store   
   * @param {Boolean} allowReferences - Allows objects and functions to be stored as references.
   */
  set(stateName, value, allowReferences) {
    nameWarning(stateName, 'stateName');

    if (typeof value === 'function' && allowReferences) {
      console.warn(`${stateName} is not a valid value. A value cannot be a function`);
      return;
    }
    const resolvedValue = typeof value === 'object' && value !== null && !allowReferences ? JSON.stringify(value) : value;

    store[stateName] = resolvedValue;
    subscriptions(stateName);
  },
  subscribe(stateName, ref, callback) {
    nameWarning(ref, 'ref');
    if (subscribers[stateName] === undefined) {
      subscribers[stateName] = {};
    }


    if (subscribers[stateName][ref] !== undefined) {
      console.warn(`There is already a subscriber using ref ${ref} subscribed to ${stateName}`);
      return;
    }

    subscribers[stateName][ref] = callback;
  },
  unsubscribe(stateName, ref) {
    if (subscribers[stateName] === undefined) {
      console.warn(`State ${stateName} does not exist`);
      return;
    }
    if (subscribers[stateName][ref] === undefined) {
      console.warn(`[${stateName}][${ref}] does not exist or has already been unsubscribed`);
    }
    const state = subscribers[stateName];
    return delete state[ref]; // true | false
  },
  /**
   * Mutate is for neiche scenarios where you may need to modyfy
   * the store or subscibers significantly.  
   * The store and subscribers can be modified within the callback. 
   * An object should be returned within the callback containing 
   * the new "store" and "subscribers" values.
   * @param {Function} callback 
   */
  mutate(callback) {
    if (typeof callback === 'function') {
      const { store: newStore, subscribers: newSubscribers } = callback(store, subscribers);
      store = newStore || store; 
      subscribers = newSubscribers || subscribers;
    }
  }
}

export default state;

// TODO: use finite state machine for game engine
// TODO: use browserify to get es6 and import

var initialState = {};

// store: { getState: function, setState: function }
var store = (function initialStore (defaultState) {
  var state = defaultState || {};
  return {
    getState: function getState (prop) {
      return state[prop];
    },
    setState: function setState (prop, value) {
      state[prop] = value;
    },
  };
}(initialState));

function keyMap (key, map) {
  if (!Object.keys(map).includes(key)) {
    return map.default;
  }
  return map[key];
}

function appendToChatHistory (message) {
  $('.chat-history').append('<p></p>');
  $('.chat-history > p:last-child').text(message);
}

function navigate (location) {
  window.location = location;
}

function navigator (location) {
  return function _navigator () {
    return navigate(location);
  };
}

function messageNavigator (location) {
  return function _messageNavigator () {
    $('.prompt').attr('disabled', true);
    appendToChatHistory('Navigating to ' + location + '...');
    window.setTimeout(navigator(location), 1000);
  };
}

function openDoor (door) {
  if (!door) {
    store.setState('askedOpenWhichDoor', true);
    return 'Which door?';
  }
  return 'The door is locked.';
}

function useKeyOnDoor (door) {
  if (!door) {
    store.setState('askedUnlockWhichDoor', true);
    return 'Which door?';
  }
  return 'The door is locked.';
}

function useKeyOnNorthDoor () {
  var isLockedStatus, isNorthDoorUnlocked;

  isNorthDoorUnlocked = store.getState('isNorthDoorUnlocked');
  isLockedStatus = isNorthDoorUnlocked ? 'unlocked' : 'locked';

  store.setState('isNorthDoorUnlocked', !isNorthDoorUnlocked);

  return [
    'You put the key in the lock and turn.',
    '*kerchunk*',
    'The north door is ' + isLockedStatus + '.',
  ];
}

function useKeyOnSouthDoor () {
  return [
    'You put the key in the lock and turn.',
    'The lock doesn\'t budge.',
  ];
}

function north (lookNorth) {
  var isNorthDoorUnlocked = store.getState('isNorthDoorUnlocked');

  if (store.getState('askedOpenWhichDoor')) {
    store.setState('askedOpenWhichDoor', false);
    if (isNorthDoorUnlocked) {
      store.setState('isNorthDoorOpen', true);
      return 'The north door is now open. You see only darkness beyond.';
    }
    return 'The north door is locked.';
  }
  if (store.getState('askedUnlockWhichDoor')) {
    return useKeyOnNorthDoor;
  }
  return lookNorth;
}

function south (lookSouth) {
  if (store.getState('askedOpenWhichDoor')) {
    store.setState('askedOpenWhichDoor', false);
    return 'The south door is locked.';
  }
  if (store.getState('askedUnlockWhichDoor')) {
    return useKeyOnSouthDoor;
  }
  return lookSouth;
}

// TODO: convert to use redux
function chatResponse (message) {
  var res;
  var blogNavigator = messageNavigator('http://blog.jeremymeyer.io');
  var hireNavigator = messageNavigator('http://jeremymeyer.io/hire');
  var portfolioNavigator = messageNavigator('http://jeremymeyer.io/portfolio');

  var lookPoster = 'There is a poster on the north wall. It is a picture of a ____. It reads ____.';
  var lookFishTank = 'There is a fish tank beside the desk. It contains a koi fish. The water is draining, slowly.';
  var lookTerminal = 'It\'s old, looks like it could be from the 70\'s. The text is green on a thick glass screen. There is an I/O switch set to I.';
  var lookNorth = 'To the north, there is a poster on the wall and a door.';
  var lookSouth = 'There is a door to the south.';

  res = keyMap(message, {
    'help': 'Try one of these commands: blog, hire, look',

    'blog': blogNavigator,
    'read blog': blogNavigator,
    'goto blog': blogNavigator,

    'hire': hireNavigator,
    'goto hire': hireNavigator,

    'portfolio': portfolioNavigator,
    'view portfolio': portfolioNavigator,
    'goto portfolio': portfolioNavigator,

    'look': 'You are in a 30x30 foot room with a fish tank, desk with a terminal, and two doors, to the north and south.',

    'look north': lookNorth,
    'look east': 'There is a fish tank on the east wall, next to the desk.',
    'look south': lookSouth,
    'look west': 'There is nothing to the west.',

    'look poster': lookPoster,
    'look at poster': lookPoster,

    'look fish': lookFishTank,
    'look fishtank': lookFishTank,
    'look fish tank': lookFishTank,
    'look tank': lookFishTank,
    'look at fish': lookFishTank,
    'look at fishtank': lookFishTank,
    'look at fish tank': lookFishTank,
    'look at tank': lookFishTank,

    'look terminal': lookTerminal,
    'look at terminal': lookTerminal,

    'open': 'Open what?',
    'door': 'What about a door?',

    'open door': openDoor,
    'try door': openDoor,

    'open north door': openDoor('north'),
    'try north door': openDoor('north'),
    'open south door': openDoor('south'),
    'try south door': openDoor('south'),

    'use key': openDoor,
    'try key': openDoor,
    'use key on door': openDoor,
    'try key on door': openDoor,

    'use key on north door': useKeyOnNorthDoor,
    'use key to open north door': useKeyOnNorthDoor,
    'use key north door': useKeyOnNorthDoor,
    'try key on north door': useKeyOnNorthDoor,
    'try key to open north door': useKeyOnNorthDoor,
    'try key north door': useKeyOnNorthDoor,

    'use key on south door': useKeyOnSouthDoor,
    'use key to open south door': useKeyOnSouthDoor,
    'use key south door': useKeyOnSouthDoor,
    'try key on south door': useKeyOnSouthDoor,
    'try key to open south door': useKeyOnSouthDoor,
    'try key south door': useKeyOnSouthDoor,

    'north': north(lookNorth),
    'south': south(lookSouth),

    'default': 'I don\'t know that command. Try one of these commands: blog, hire, look'
  });

  if (typeof res === 'function') {
    return res();
  }

  return res;
}

$(function onLoadZepto ($) {
  console.log('loaded zepto');
  $('.prompt-form').on('submit', function onSubmitPromptForm (e) {
    var message;

    console.log('submitted prompt');
    e.preventDefault();

    message = $('.prompt').val().trim();

    $('.prompt').val('');
    appendToChatHistory(message);
    appendToChatHistory(chatResponse(message));
  });
});

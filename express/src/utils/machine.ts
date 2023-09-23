import { createMachine } from 'xstate';
import { ServerToClientEvents } from './socketio';

export const enum State {
    INIT = '初始化',
    SYNCING = '同步中',
    SYNCED = '已同步',
    PLAYING = '播放中'
}

type MachineEvent = { type: keyof ServerToClientEvents, currentTime?: number }

type MachineTypestate = {
    value: State;
    context: any;
}

const machine = createMachine<any, MachineEvent, MachineTypestate>({
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCGBjAFgSwHZgDpAYFUFNrQWjkBiAJzFQgE8BtABgF1FQAHAe1mwBds3XBxAAPRAEYAbNIA0IeogBMzZQWUBWAL7aFaLHkKAn3VIVOAG1RM2onn0HDREhAGYAHAE4Nk9wHZNBSUEVXUtXX0MHHwCQFqTQD5TSk5UAFdYMBZ2JBB7ASERbJcPb2VfAKDEd0kCHQiQXG4IOFEDaLA7XjynQsQAWnlFPuk61qNicg6HfOdEABZlCoR-GvdXNfWNtZGosdMSSa6C0BdlP2Yff0DBkLUCAO3DGISyA8cj8TnPaQJZ6UvFzznZirTabWa6XRAA */
    id: 'machine',
    initial: State.INIT,
    states: {
        [State.INIT] : {
            on: {
                'ready': State.SYNCING
            }
        },
        [State.SYNCING]: {
            on: {
                'ready': {
                    target: State.SYNCED
                }
            }
        },
        [State.SYNCED]: {
            on: {
                'play': {
                    target: State.PLAYING
                }
            }
        },
        [State.PLAYING]: {
            on: {
                'pause': {
                    target: State.SYNCING
                }
            },
        }
    }
});

export default machine;
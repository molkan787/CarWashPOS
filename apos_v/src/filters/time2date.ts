import utils from '../utils';

export default {
    ts2date: (time: number) => utils.timestampToDate(time),
    ts2datetime: (time: number) => utils.timestampToDate(time, true),
};
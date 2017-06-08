/**
 * Created by chengshi on 2017/4/26.
 */
const [levels, getLevel] = [
    {
        DEBUG: {
            weight: 1,
            title: 'DEBUG:'
        },
        INFO: {
            weight: 2,
            title: 'INFO:'
        },
        WARN: {
            weight: 3,
            title: 'WARN:'
        },
        ERROR: {
            weight: 4,
            title: 'ERROR:'
        },
        FATAL: {
            weight: 5,
            title: 'FATAL:'
        }
    },
    () => app.config && app.config.debug ? levels.DEBUG : levels.ERROR];

export default {
    debug(object){
        this.print(levels.DEBUG, object);
    },
    info(object){
        this.print(levels.INFO, object);
    },
    warn(object){
        this.print(levels.WARN, object);
    },
    error(object){
        this.print(levels.ERROR, object);
    },
    fatal(object){
        this.print(levels.FATAL, object);
    },
    print(level, object) {
        if (!window.console || !window.console.log) {
            return;
        }
        if (level != undefined && level.weight < getLevel()) {
            return;
        }
        console.log(level.title + object);
    }
}
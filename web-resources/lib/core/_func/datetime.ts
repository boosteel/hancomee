let second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24,
    __day = ["일", "월", "화", "수", "목", "금", "토"],

    r_datetime = /yyyy|yy|M{1,2}|d{1,2}|E|HH|mm|ss|a\/p/gi,
    _zf = (v: number) => v < 10 ? '0' : '',

    // 숫자 자리수 맞추기
    zeroFill = (t) => _zf(t) + t,
    _switch = {
        'yyyy': (d) => d.getFullYear(),
        'yy': (d) => zeroFill(d.getFullYear() % 1000),
        'M': (d) => d.getMonth() + 1,
        'MM': (d) => zeroFill(d.getMonth() + 1),
        'd': (d) => d.getDate(),
        'dd': (d) => zeroFill(d.getDate()),
        'E': (d) => __day[d.getDay()],
        'HH': (d) => zeroFill(d.getHours()),
        'hh': (d) => zeroFill(d.getHours()),
        'mm': (d) => zeroFill(d.getMinutes()),
        'ss': (d) => zeroFill(d.getSeconds()),
        'a/p': (d) => d.getHours() < 12 ? "오전" : "오후",
    };

export function _toKor(date, now = new Date().getTime()) {
    var duration = now - (typeof date === 'number' ? date : new Date(date).getTime());
    if (duration > day)
        return Math.floor(duration / day) + '일 전';
    if (duration > hour)
        return Math.floor(duration / hour) + '시간 전';
    if (duration > minute)
        return Math.floor(duration / minute) + '분 전';
    if (duration > second)
        return Math.floor(duration / second) + '초 전';
}

export function _dateFormat(_date, f) {
    if (!_date) return '';

    var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
    if(!f) return _datetime(d);

    return f.replace(r_datetime, ($1) => {
        if (temp = _switch[$1]) return temp(d);
        else return $1;
    });
};

export function _datetime(val: Date) {
    let m = val.getMonth() + 1, d = val.getDate(),
        h = val.getHours(), s = val.getSeconds(), M = val.getMinutes();

    return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d, ' ',
        _zf(h), h, ':', _zf(s), s, ':', _zf(M), M].join('');
}

export function _date(val: Date) {
    let m = val.getMonth() + 1, d = val.getDate();

    return [val.getFullYear(), '-', _zf(m), m, '-', _zf(d), d].join('');
}
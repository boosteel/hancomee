let now = new Date().getTime(),
    second = 1000, minute = second * 60, hour = minute * 60, day = hour * 24,
    __day = ["일", "월", "화", "수", "목", "금", "토"],

    // 숫자 자리수 맞추기
    zeroFill = (_target, len) => {
        var target = _target.toString();
        while (target.length < len)
            target = '0' + target; // 모자란 숫자는 앞에 0으로 채운다.
        return target;
    }

function toKor(date) {
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

function _format(_date, f) {
    if (f === void 0) {
        f = 'yyyy-MM-dd HH:mm';
    }
    if (!_date)
        return '';
    var d = typeof _date === 'number' ? new Date(_date) : _date, temp;
    return f.replace(/yyyy|yy|M{1,2}|d{1,2}|E|HH|mm|ss|a\/p/gi, function ($1) {
        switch ($1) {
            case "yyyy":
                return d.getFullYear();
            case "yy":
                return zeroFill(d.getFullYear() % 1000, 2);
            case "M":
                return d.getMonth() + 1;
            case "MM":
                return zeroFill(d.getMonth() + 1, 2);
            case "dd":
                return zeroFill(d.getDate(), 2);
            case "d":
                return d.getDate();
            case "E":
                return __day[d.getDay()];
            case "HH":
                return zeroFill(d.getHours(), 2);
            case "hh":
                return ((temp = d.getHours() % 12) ? temp : 12).zf(2);
            case "mm":
                return zeroFill(d.getMinutes(), 2);
            case "ss":
                return zeroFill(d.getSeconds(), 2);
            case "a/p":
                return d.getHours() < 12 ? "오전" : "오후";
            default:
                return $1;
        }
    });
};

// 몇째주인지 확인
function weekNum(date, day) {
    var week = 1;
    while (date-- > 0) {
        if (--day < 0) {
            week++;
            day = 7;
        }
    }
    return week;
}

export class Month {

    // month는 0부터
    constructor(public year: number, public month: number) {
    }

    move(val: number) {
        let {year, month} = this,
            i = 1;
        if (val < 0) val = val * (i = -1);

        while(val-- > 0) {
            month = month + i;
            if(month > 11) {
                year++;
                month = 0;
            }
            else if(month < 0) {
                year--;
                month = 11;
            }
        }
        return new Month(year, month);
    }

    toArray() {
        return Calendar.toArray(this.year, this.month);
    }

    toString() {
        return this.year + '-' + (this.month + 1);
    }
}

export class Calendar {

    private value: Date

    constructor(_value?: Date | number) {
        if (_value == null)
            this.value = new Date();
        else
            this.value = _value instanceof Date ? _value : new Date(_value);
    }

    get year() {
        return this.value.getFullYear();
    }

    get month() {
        return this.value.getMonth();
    }

    get date() {
        return this.value.getDate();
    }

    get day() {
        return this.value.getDay();
    }

    get longtime() {
        return this.value.getTime();
    }

    // Date와 인터페이스를 맞추기 위한 메서드들
    getFullYear() {
        return this.year;
    }

    getMonth() {
        return this.month;
    }

    $date(num: number) {
        if (!num) return this;
        return new Calendar(new Date(this.longtime + (num * day)));
    }

    $month(num: number) {
        if (!num) return this;

        var _a = this, y = _a.year, m = _a.month, date = _a.date,
            expectMonth = m + num, // 희망하는 달
            len = y * 12 + expectMonth, // 년도를 달로 고쳐서 숫자를 만든다.
            result = new Calendar(new Date(len / 12, len % 12, date));
        /*
         *  만약 this가 10월 31일 이라면, 달만 더하면 11월 31일이 되는데,
         *  11월 31일은 없으므로 12월 1일이 되어버린다.
         *  따라서 이를 보정한다.
         *  해당하는 달이 될때까지 날짜를 빼나간다.
         */
        var i = 11;
        expectMonth = expectMonth % 12;
        expectMonth = expectMonth < 0 ? 11 : expectMonth;
        while (result.month !== expectMonth) {
            result = result.$date(-1);
            // 로직에 문제는 없지만 혹시 모르니까 추가해둔다.
            // 여기서 무한루프에 빠지면 디버깅이 존나 힘들것이므로..
            if (i-- < 0)
                throw new Error('무한루프에 빠질 위험이 있습니다!!');
        }
        return result;
    }

    $year(num: number) {
        if (!num)
            return this;
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        return new Calendar(new Date(year + num, month, date));
    }

    getFirstDate() {
        return new Calendar(new Date(this.year, this.month, 1));
    }

    getLastDate() {
        return new Calendar(new Date(this.year, this.month + 1, 0));
    }

    setTime(value?: Date) {
        if (value === void 0) {
            value = new Date();
        }
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        return new Calendar(new Date(year, month, date, value.getHours(), value.getMinutes(), value.getSeconds()));
    }

    get isodate() {
        return this.year + '-' + this.month_kr() + '-' + this.date_kr();
    }

    year_kr() {
        return this.year + '';
    }

    month_kr() {
        var month = this.month + 1;
        return (month < 10 ? '0' : '') + month;
    }

    date_kr() {
        var date = this.date;
        return (date < 10 ? '0' : '') + date;
    }

    day_kr() {
        return __day[this.day];
    }

    durationDate(target: Date) {
        var origLong = Math.floor(this.longtime / day) * day, targetLong = Math.floor(target.getTime() / day) * day;
        return (targetLong - origLong) / day;
    }

    durationMonth(target) {
        var origY = this.getFullYear() * 12 + this.getMonth(), targetY = target.getFullYear() * 12 + target.getMonth();
        return targetY - origY;
    }

    durationYear(target) {
        return target.getFullYear() - this.getFullYear();
    }

    format(str?: string) {
        if (str === void 0) {
            str = 'yyyy-MM-dd';
        }
        return _format(this.value, str);
    }

    equals(data) {
        var _a = this, year = _a.year, month = _a.month, date = _a.date;
        if (year !== data.getFullYear())
            return false;
        if (month !== data.getMonth())
            return false;
        if (date !== data.getDate())
            return false;
        return true;
    }

    toString() {
        return _format(this.value, 'yyyy-MM-dd HH:mm:ss');
    }

    clone() {
        return new Calendar(this.longtime);
    }
}

export namespace Calendar {

    export let format = _format;

    export function create(year: number, month: number, date: number, h: number, m: number, s: number): Calendar
    export function create(year: number, month: number, date: number): Calendar
    export function create(value: number): Calendar
    export function create(value: Date): Calendar
    export function create(): Calendar
    export function create(v1?, v2?, v3?, v4?, v5?, v6?) {
        let v = v1;

        if (typeof v6 === 'number') v = new Date(v1, v2 - 1, v3, v4, v5, v6);
        else if (typeof v3 === 'number') v = new Date(v1, v2 - 1, v3);

        return new Calendar(v);
    }


    function monthInfo(year, month) {
        var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
        return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
    }


    function today(str: string = 'yyyy-MM-dd') {
        return _format(new Date(), str);
    }

    // 달력을 만들기 위한 배열
    export function toArray(y, m): Calendar[][] {

        var _a = monthInfo(y, m), fd = _a[1], l = _a[2],
            start = new Calendar(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
            row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];

        while (row > 0) {
            var r = [];
            for (; i < 7; i++) {
                r.push(start = start.$date(1));
            }
            result.push(r);
            i = 0;
            row--;
        }
        return result;
    }

    export function isodate(year: number, month: number, day: number)
    export function isodate(date: Date)
    export function isodate(y, m?, d?) {
        let date: Date = y;
        if (typeof d === 'number') date = new Date(y, m, d);
        return _format(date, 'yyyy-MM-dd');
    }
}


/*
(function (DateManager) {
    DateManager.format = exports._format;

    // 시간을 뺀 날짜만
    function today() {
        var date = new Date();
        return new DateManager(date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate());
    }

    DateManager.today = today;

    function monthRange(dm) {
        var _a = monthInfo(dm.year, dm.month), firstDate = _a[0], firstDay = _a[1], lastDate = _a[2], lastDay = _a[3];
    }

    DateManager.monthRange = monthRange;
})(DateManager = exports.DateManager || (exports.DateManager = {}));
exports.DateManager = DateManager;
// [첫째일, 요일, 마지막일, 요일]
// month는 0부터 시작
function monthInfo(year, month) {
    var first = new Date(year, month, 1), last = new Date(year, month + 1, 0);
    return [first.getDate(), first.getDay(), last.getDate(), last.getDay()];
}

exports.monthInfo = monthInfo;

// 달력을 만들기 위한 배열
function daysOfMonth(y, m) {
    var _a = monthInfo(y, m), fd = _a[1], l = _a[2],
        start = new DateManager(new Date(y, m, 1)).$date((fd % 7 * -1) - 1), // 1를 빼는 이유는 일요일도 포함시키기 위함
        row = Math.ceil((l + fd % 7) / 7), i = 0, result = [];
    while (row > 0) {
        var r = [];
        for (; i < 7; i++) {
            r.push(start = start.$date(1));
        }
        result.push(r);
        i = 0;
        row--;
    }
    return result;
}

exports.daysOfMonth = daysOfMonth;*/

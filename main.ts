interface ISubject {
    readonly observers: IObserver[];
    state: ISubjectState<any>;
    subscribeObserver(observer: IObserver): void;
    unsubscribeObserver(observer: IObserver): void;
    notifyObservers(): void;
}

interface IObserver {
    update(eventListener: ISubject): void;
}

interface ISwitcher {
    readonly state: boolean; 
    // Or turn(state: boolean)
    // Depends on turn logic complexity
    turnOff(): void;
    turnOn(): void;
}

interface ISubjectState<T> {
    data: T;
}

class OilDerrick implements ISubject {

    private _state: ISubjectState<number> = { data: 32 };
    private _observers: IObserver[] = [];

    public get state(): ISubjectState<number> {
        return this._state;
    }

    public set state(value: ISubjectState<number>) {
        if (this._state != value) {
            this._state = value;
            this.notifyObservers();
        }
    }

    public get observers(): IObserver[] {
        return this._observers;
    }

    subscribeObserver(observer: IObserver): void {
        const exists = this._observers.includes(observer);
        if (!exists)
            this._observers.unshift(observer);
    }

    unsubscribeObserver(observer: IObserver): void {
        const i = this._observers.indexOf(observer);
        if (i > -1)
            this._observers.splice(i, 1);
    }

    notifyObservers(): void {
        for (const observer of this._observers) {
            observer.update(this);
        }
    }
}

class OverheatObserver implements IObserver {

    private _switcher: ISwitcher;
    public static readonly OFF_TEMP: number = 70;
    public static readonly ON_TEMP: number = 32;

    constructor(switcher: ISwitcher) {
        this._switcher = switcher;
    }

    update(subject: ISubject) {
        const { data } = subject.state;

        if (this._switcher.state) {
            if (data >= OverheatObserver.OFF_TEMP) {
                this._switcher.turnOff();
            }
        }
        else {
            if (data <= OverheatObserver.ON_TEMP) {
                this._switcher.turnOn();
            }
        }
    }
}

class Switcher implements ISwitcher {

    protected _state: boolean;

    constructor(state: boolean = false) {
        this._state = state;
    } 

    public get state(): boolean {
        return this._state;
    }

    turnOn(): void {
        this._state = true;
    }

    turnOff(): void {
        this._state = false;
    }
}

class OilPumpSwitcher extends Switcher {

    turnOn(): void {
        // OilPump turn logic
        super.turnOn();
    }

    turnOff(): void {
        // OilPump turn logic
        super.turnOff();
    }
}

const subject = new OilDerrick()
const switcher = new OilPumpSwitcher();
const observer = new OverheatObserver(switcher);

subject.subscribeObserver(observer);

subject.state = { data: Math.ceil(Math.random() * 100) };

import { useState } from 'react';
import '../styles/Checkout.scss';
export default function Checkout() {

    const [timeOption, setTimeOption] = useState(1);
    const [placeOption, setPlaceOption] = useState(1);

    const handleTimeOption = (option) => {
        setTimeOption(option)
    }
    const handlePlaceOption = (option) => {
        setPlaceOption(option)
    }

    return (
        <div className="checkout">
            <div className="checkout__form">
                <div className='checkout__form__header'>Opcje Realizacji: </div>
                <div className='checkout__form__orderTime'>
                    <p>Zamówienie na:</p>
                    <div className={'formFieldWrap ' + (timeOption === 1 ? 'formFieldWrap--active' : '')} onClick={() => handleTimeOption(1)}>
                        <input
                            id="asap"
                            name="orderTime"
                            type="radio"
                            value='asap'
                            onChange={() => null}
                            checked={timeOption === 1}
                        />
                        <label htmlFor="asap"> ASAP</label>
                    </div>
                    <div className={'formFieldWrap ' + (timeOption === 2 ? 'formFieldWrap--active' : '')} onClick={() => handleTimeOption(2)}>
                        <input
                            id="time"
                            name="orderTime"
                            type="radio"
                            value='time'
                            onChange={() => null}
                            //onChange={e => setCurrentValue(e.target.value)}
                            checked={timeOption === 2}
                        />
                        <label htmlFor="timeSlot">On Time</label>
                        {timeOption === 2 &&
                            <div className='checkout__form__orderTime__timeSlot'>
                                <select>
                                    <option>15:00</option>
                                    <option>15:30</option>
                                    <option>16:00</option>
                                    <option>13:30</option>
                                </select>
                            </div>
                        }
                    </div>
                </div>
                <div className='checkout__form__orderPlace'>
                    <div>Sposób realizacji:</div>
                    <div className={'formFieldWrap ' + (placeOption === 1 ? 'formFieldWrap--active' : '')} onClick={() => handlePlaceOption(1)}>
                        <input
                            id="delivery"
                            name="delivery"
                            type="radio"
                            value='delivery'
                            onChange={() => null}
                            checked={placeOption === 1}
                        />
                        <label htmlFor="delivery">Dostawa</label>
                    </div>
                    <div className={'formFieldWrap ' + (placeOption === 2 ? 'formFieldWrap--active' : '')} onClick={() => handlePlaceOption(2)}>
                        <input
                            id="pickup"
                            name="pickup"
                            type="radio"
                            value='pickup'
                            onChange={() => null}
                            //onChange={e => setCurrentValue(e.target.value)}
                            checked={placeOption === 2}
                        />
                        <label htmlFor="pickup">Odbiór własny</label>

                    </div>
                    <div className={'formFieldWrap ' + (placeOption === 3 ? 'formFieldWrap--active' : '')} onClick={() => handlePlaceOption(3)}>
                        <input
                            id=""
                            name="forHere"
                            type="radio"
                            value='pickup'
                            onChange={() => null}
                            //onChange={e => setCurrentValue(e.target.value)}
                            checked={placeOption === 3}
                        />
                        <label htmlFor="forHere">Zjem na miejscu</label>

                    </div>
                </div>
                {placeOption === 1 &&
                    <div className='checkout__form__orderAddress '>
                        <div className='checkout__form__orderAddress__city'>
                            <label htmlFor='city'>Miasto</label>
                            <input type='text' id='city' />
                        </div>
                        <div className='checkout__form__orderAddress__group1'>
                            <div className='checkout__form__orderAddress__group1__street'>
                                <label htmlFor='street'>Ulica</label>
                                <input type='text' id='street' />
                            </div>

                            <div className='checkout__form__orderAddress__group1__houseNumber'>
                                <label htmlFor='houseNumber'>Numer domu</label>
                                <input type='text' id='houseNumber' />
                            </div>
                        </div>
                        <div className='checkout__form__orderAddress__group2'>
                            <div className='checkout__form__orderAddress__group2__apartmentNumber'>
                                <label htmlFor='apartmentNumber'>Numer mieszkania</label>
                                <input type='text' id='apartmentNumber' />
                            </div>
                            <div className='checkout__form__orderAddress__group2__floor'>
                                <label htmlFor='floor'>Piętro</label>
                                <input type='text' id='floor' />
                            </div>
                        </div>
                    </div>
                }
                <div className='checkout__form__note'>
                    <label htmlFor='note'>Uwagi do zamówienia</label>
                    <textarea rows="3" id='note' ></textarea>
                </div>
                <div className='checkout__form__note'>

                </div>
            </div>
            <div className="checkout__summary">
                <div className="checkout__summary__header">Koszyk:</div>
                <div className="checkout__summary__content">
                    <div className='checkout__summary__content__item'>
                        <div className="checkout__summary__content__item__name">Polędwiczki</div>
                        <div className="checkout__summary__content__item__price">32,6</div>
                    </div>
                    <div className='checkout__summary__content__item'>
                        <div className="checkout__summary__content__item__name">Kebab</div>
                        <div className="checkout__summary__content__item__price">32,6</div>
                    </div>
                    <div className='checkout__summary__content__item'>
                        <div className="checkout__summary__content__item__name">Zapiekanka</div>
                        <div className="checkout__summary__content__item__price">32,6</div>
                    </div>
                </div>
                <div className='checkout__summary__price'>
                    <div className='checkout__summary__price__name'>SUMA:</div>
                    <div className='checkout__summary__price__amount'>120,80 zł</div>
                </div>
                <div className="checkout__summary__button">
                    <button className='button-contained'>ZAMÓW</button>
                </div>
            </div>
        </div>
    )
}

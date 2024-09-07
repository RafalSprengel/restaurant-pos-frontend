import { NavLink, useNavigate, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { createSlug } from '../utils/utils.js';
import '../styles/Menu.scss';
import SingleDish from '../components/SingleDish';
import { useShoppingCart } from '../context/ShoppingCartContext.js';



const SingleMenuEl = ({ el, category, searchParams }) => {
    let isActive = (category == createSlug(el.name));
    if (window.location.href.endsWith('/menu') && el.showAll) isActive = true;
    let link = (el.showAll) ? '/menu' : `/menu?category=${createSlug(el.name)}`;
    return (
        <NavLink to={link} className='menu__item-categories__list__item'>
            <div className={'menu__item-categories__list__item__icon-container ' + (isActive ? 'menu__item-categories__list__item__icon-container--active' : '')}>
                <span className='material-symbols-outlined'>
                    {el.googleIconName}
                </span>
            </div>
            <div className={'menu__item-categories__list__item__name-container ' + (isActive ? 'menu__item-categories__list__item__name-container--active' : '')}>
                {el.name}
            </div>
        </NavLink >
    )
}

export const Menu = ({ mealCategories, mealsList }) => {
    const [searchParams, setSearchParams] = useSearchParams({ search: '', category: "" });
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const navigate = useNavigate();
    const { openProduct } = useShoppingCart()

    const handleOnChange = (e) => {
        const newValue = e.target.value;
        setSearchParams({ search: newValue }, { replace: true });
        if (newValue === '') {
            navigate('/menu');
        }
    }

    return (
        <div className="menu">
            <div className="menu__header"><h1>Menu</h1></div>
            <div className="menu__search">

                <input
                    type="search"
                    placeholder='Znajdź swoje danie'
                    onChange={e => handleOnChange(e)}
                >
                </input>
            </div>
            <div className="menu__item-categories">
                <ul className='menu__item-categories__list'>
                    {mealCategories.map((el, index) => <SingleMenuEl el={el} key={index} category={category} searchParams={searchParams} />)}
                </ul>

            </div>

            <div className='menu__items-list'>
                <div className="menu__items-list__title">
                    {mealCategories.find((el) => createSlug(el.name) === category)?.name}
                </div>

                <div className='menu__items-list__content'>
                    {
                        <>
                            {(!search) &&
                                mealsList.map((el, index) => {
                                    if (createSlug(el.category) === category || category === '' || window.location.href.endsWith('/menu')) {
                                        return (
                                            <div onClick={() => openProduct(el)} key={index}>
                                                <SingleDish singleDish={el} />
                                            </div>
                                        );
                                    }
                                })
                            }
                        </>
                    }

                    {search &&
                        <> <div>Search to : {search}</div>
                            {
                                mealsList.map((meal, index) => {
                                    const regex = new RegExp(search, 'i');
                                    if (regex.test(meal.name) || regex.test(meal.category)) {
                                        return (
                                            < div onClick={() => openProduct(meal)} key={index}>
                                                <SingleDish singleDish={meal} key={index} />
                                            </div >
                                        )
                                    }
                                })
                            }
                        </>
                    }

                </div>
            </div>
        </div >
    )
}

export default Menu;
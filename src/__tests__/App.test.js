import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { ShoppingCartProvider } from '../context/ShoppingCartContext';

jest.mock('../components/MainLayout', () => () => <div data-testid="main-layout" />);
jest.mock('../components/AdminLayout', () => () => <div data-testid="admin-layout" />);
jest.mock('../pages/HomePage', () => () => <div data-testid="home-page" />);
jest.mock('../pages/Menu', () => () => <div data-testid="menu-page" />);
jest.mock('../pages/Checkout', () => () => <div data-testid="checkout-page" />);
jest.mock('../pages/EventsPage', () => () => <div data-testid="events-page" />);
jest.mock('../pages/Kontakt', () => () => <div data-testid="kontakt-page" />);
jest.mock('../pages/Promocje', () => () => <div data-testid="promocje-page" />);
jest.mock('../pages/ONas', () => () => <div data-testid="o-nas-page" />);
jest.mock('../pages/NotFound', () => () => <div data-testid="not-found-page" />);
jest.mock('../pages/Admin', () => () => <div data-testid="admin-page" />);

describe('App component', () => {
    const renderApp = (route) => {
        render(
            <MemoryRouter initialEntries={[route]}>
                <App />
            </MemoryRouter>
        );
    };

    test('renders HomePage for root path', () => {
        renderApp('/');
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders Menu page for /menu path', () => {
        renderApp('/menu');
        expect(screen.getByTestId('menu-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders Checkout page for /order/checkout path', () => {
        renderApp('/order/checkout');
        expect(screen.getByTestId('checkout-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders EventsPage for /imprezy-okolicznosciowe path', () => {
        renderApp('/imprezy-okolicznosciowe');
        expect(screen.getByTestId('events-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders Kontakt page for /kontakt path', () => {
        renderApp('/kontakt');
        expect(screen.getByTestId('kontakt-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders Promocje page for /promocje path', () => {
        renderApp('/promocje');
        expect(screen.getByTestId('promocje-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders ONas page for /o-nas path', () => {
        renderApp('/o-nas');
        expect(screen.getByTestId('o-nas-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders NotFound page for unknown path', () => {
        renderApp('/unknown-path');
        expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
        expect(screen.getByTestId('main-layout')).toBeInTheDocument();
    });

    test('renders Admin page for /admin path', () => {
        renderApp('/admin');
        expect(screen.getByTestId('admin-page')).toBeInTheDocument();
        expect(screen.getByTestId('admin-layout')).toBeInTheDocument();
    });

    test('renders ShoppingCartProvider', () => {
        const { container } = render(
            <MemoryRouter>
                <App />
            </MemoryRouter>
        );
        expect(container.firstChild).toBeInTheDocument();
    });
});

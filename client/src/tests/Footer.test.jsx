/**
 * Footer.test.jsx
 * Tests that the Footer renders the brand name and copyright line.
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import Footer from '../components/Footer';

describe('Footer', () => {
    beforeEach(() => {
        render(<Footer />);
    });

    it('renders the MOVIEFLIX brand name', () => {
        expect(screen.getByText('MOVIEFLIX')).toBeInTheDocument();
    });

    it('renders copyright text with current year', () => {
        const year = new Date().getFullYear().toString();
        const copyright = screen.getByText(new RegExp(year));
        expect(copyright).toBeInTheDocument();
    });

    it('renders inside a <footer> element', () => {
        const footer = document.querySelector('footer');
        expect(footer).not.toBeNull();
    });

    it('copyright span contains "MovieFlix"', () => {
        // Two elements match /MovieFlix/i: the brand ("MOVIEFLIX") and the copyright span.
        // Verify the copyright span is one of them.
        const elements = screen.getAllByText(/movieflix/i);
        expect(elements.length).toBeGreaterThanOrEqual(2);
        const copyrightText = elements.find(el =>
            el.textContent.includes('All rights reserved')
        );
        expect(copyrightText).toBeTruthy();
    });
});

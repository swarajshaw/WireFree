/// <reference types="jest" />
import { render, screen } from '@testing-library/react'
import Home from '../pages/index'

describe('Home', () => {
  it('renders the portal title', () => {
    render(<Home />)
    expect(screen.getAllByText(/WireFree Admin Portal/i).length).toBeGreaterThan(0)
  })
})

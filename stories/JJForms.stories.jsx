import React from 'react'
import {
  BootstrapStyledProvider,
  Button,
  FormControl,
  FormLabel,
  FormText,
  FormSelect,
  FormCheck,
  FloatingLabel,
  InputGroup,
  InputGroupText,
} from '@metatoy/bootstrap-styled'
import { sorbBsTheme } from '../src/sorbBsTheme'

// Form-surface captures for the Jane's Jeans Checkout screen. Field chrome
// (bg/border/radius) binds to the denim bs.* + semantic tokens; no dedicated
// input.* tier needed (the G0 audit decision).
export default {
  title: 'JanesJeans/Forms',
  decorators: [
    (Story) => (
      <BootstrapStyledProvider theme={sorbBsTheme}>
        <div style={{ width: 420 }}>
          <Story />
        </div>
      </BootstrapStyledProvider>
    ),
  ],
}

export const TextField = {
  render: () => (
    <div>
      <FormLabel>First name</FormLabel>
      <FormControl placeholder="Jane" />
    </div>
  ),
}

export const TextFieldHelp = {
  render: () => (
    <div>
      <FormLabel>Email address</FormLabel>
      <FormControl type="email" placeholder="you@example.com" />
      <FormText>We'll email your receipt and shipping updates here.</FormText>
    </div>
  ),
}

export const SelectField = {
  render: () => (
    <div>
      <FormLabel>Country</FormLabel>
      <FormSelect defaultValue="">
        <option value="">Choose…</option>
        <option>United States</option>
        <option>Canada</option>
      </FormSelect>
    </div>
  ),
}

export const CheckboxField = {
  render: () => (
    <FormCheck type="checkbox" label="Shipping address is the same as billing" defaultChecked readOnly />
  ),
}

export const RadioField = {
  render: () => (
    <FormCheck type="radio" name="ship" label="Standard · 4–6 business days" defaultChecked readOnly />
  ),
}

export const PromoGroup = {
  render: () => (
    <InputGroup>
      <FormControl placeholder="Try DENIM10" />
      <Button variant="outline-primary">Apply</Button>
    </InputGroup>
  ),
}

export const CardNumberGroup = {
  render: () => (
    <InputGroup>
      <InputGroupText style={{ color: 'var(--bs-primary)' }}>✓</InputGroupText>
      <FormControl inputMode="numeric" placeholder="4242 4242 4242 4242" />
    </InputGroup>
  ),
}

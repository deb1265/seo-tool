import React from 'react'
import styled from 'styled-components'

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing.lg};
`

const Title = styled.h2`
  font-size: ${props => props.theme.typography.h2};
  margin-bottom: ${props => props.theme.spacing.md};
`

const Select = styled.select`
  width: 100%;
  padding: ${props => props.theme.spacing.sm};
  border: 1px solid ${props => props.theme.colors.secondary};
  border-radius: 4px;
  margin-bottom: ${props => props.theme.spacing.sm};
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`

const Toggle = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.sm};
  cursor: pointer;
`

const ToggleInput = styled.input`
  margin-right: ${props => props.theme.spacing.sm};
`

export function ContentParameters() {
  return (
    <Section>
      <Title>Parameters</Title>
      <Select>
        <option value="">Select Language</option>
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="fr">French</option>
      </Select>
      <Select>
        <option value="">Writing Style</option>
        <option value="descriptive">Descriptive</option>
        <option value="narrative">Narrative</option>
        <option value="technical">Technical</option>
      </Select>
      <Toggle>
        <ToggleInput type="checkbox" />
        Include References
      </Toggle>
      <Toggle>
        <ToggleInput type="checkbox" />
        Competitor Analysis
      </Toggle>
    </Section>
  )
}

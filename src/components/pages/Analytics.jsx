import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  margin-bottom: ${props => props.theme.spacing.lg};
`

function Analytics() {
  return (
    <Container>
      <Title>Analytics</Title>
      {/* Add analytics content here */}
    </Container>
  );
}

export default Analytics;

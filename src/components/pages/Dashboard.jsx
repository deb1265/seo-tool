import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: ${props => props.theme.spacing.lg};
`

const Title = styled.h1`
  font-size: ${props => props.theme.typography.h1};
  margin-bottom: ${props => props.theme.spacing.lg};
`

function Dashboard() {
  return (
    <Container>
      <Title>Dashboard</Title>
      {/* Add dashboard content here */}
    </Container>
  );
}

export default Dashboard;

import React from 'react';
import styled from 'styled-components';
import { FiUser, FiSearch, FiSettings } from 'react-icons/fi';
import { useNavigation, PAGES } from '../context/NavigationContext';

const HeaderContainer = styled.header`
  height: 64px;
  padding: 0 ${props => props.theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.shadows.sm};
`

const Logo = styled.div`
  font-weight: 700;
  font-size: ${props => props.theme.typography.h3};
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  span {
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.primaryDark});
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const Nav = styled.nav`
  display: flex;
  gap: ${props => props.theme.spacing.lg};
`

const NavItem = styled.button`
  background: none;
  border: none;
  text-decoration: none;
  color: ${props => props.$isActive ? props.theme.colors.primary : props.theme.colors.neutralLight};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  font-size: ${props => props.theme.typography.body};
  font-weight: 500;
  border-radius: ${props => props.theme.borderRadius.md};
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
  }

  ${props => props.$isActive && `
    background: ${props.theme.colors.primaryLight};
  `}
`

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.neutralLight};
  cursor: pointer;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.full};
  transition: all ${props => props.theme.transitions.default};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
    background: ${props => props.theme.colors.primaryLight};
  }
`

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.full};
  background: ${props => props.theme.colors.primaryLight};
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: ${props => props.theme.typography.small};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.default};
  
  &:hover {
    transform: scale(1.05);
  }
`

function Header() {
  const { currentPage, setCurrentPage } = useNavigation();

  return (
    <HeaderContainer>
      <Logo onClick={() => setCurrentPage(PAGES.DASHBOARD)}>
        <span>ContentShake</span>
      </Logo>
      <Nav>
        <NavItem 
          onClick={() => setCurrentPage(PAGES.DASHBOARD)}
          $isActive={currentPage === PAGES.DASHBOARD}
        >
          Dashboard
        </NavItem>
        <NavItem 
          onClick={() => setCurrentPage(PAGES.PROJECTS)}
          $isActive={currentPage === PAGES.PROJECTS}
        >
          Projects
        </NavItem>
        <NavItem 
          onClick={() => setCurrentPage(PAGES.TEMPLATES)}
          $isActive={currentPage === PAGES.TEMPLATES}
        >
          Templates
        </NavItem>
        <NavItem 
          onClick={() => setCurrentPage(PAGES.ANALYTICS)}
          $isActive={currentPage === PAGES.ANALYTICS}
        >
          Analytics
        </NavItem>
      </Nav>
      <UserSection>
        <IconButton>
          <FiSearch size={20} />
        </IconButton>
        <IconButton>
          <FiSettings size={20} />
        </IconButton>
        <UserAvatar>
          JS
        </UserAvatar>
      </UserSection>
    </HeaderContainer>
  );
}

export default Header;

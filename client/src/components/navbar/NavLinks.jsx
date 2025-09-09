import { NavButton } from './NavButton';

export const NavLinks = ({ links, onNavigate, collapsed, activePath }) => (
  <nav className="flex flex-col gap-2">
    {links.map((link) => (
      <NavButton
        key={link.label}
        label={link.label}
        icon={link.icon}
        collapsed={collapsed}
        active={activePath === `/${link.path}`}
        onClick={() => {
          if (link.action) link.action();
          else onNavigate(link.path);
        }}
        variant={link.variant ?? 'contained'} // padrão = contained
      />
    ))}
  </nav>
);

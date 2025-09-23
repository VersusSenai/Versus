import { NavButton } from './NavButton';

export const NavLinks = ({ links, onNavigate, collapsed, activePath }) => {
  return (
    <nav className="flex flex-col gap-2">
      {links.map((link) => {
        const linkPath = `/${link.path}`;
        const isActive = activePath === linkPath;
        
        return (
          <NavButton
            key={link.label}
            label={link.label}
            icon={link.icon}
            collapsed={collapsed}
            active={isActive}
            onClick={() => {
              if (link.action) link.action();
              else onNavigate(link.path);
            }}
            variant={link.variant ?? 'outlined'}
          />
        );
      })}
    </nav>
  );
};

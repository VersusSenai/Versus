import { NavButton } from './NavButton';

export const NavLinks = ({ links, onNavigate, collapsed, activePath }) => {
  // verificar se links é array válido
  if (!Array.isArray(links)) {
    console.error('NavLinks: links deve ser um array', links);
    return null;
  }

  return (
    <nav className="flex flex-col gap-2">
      {links.map((link, index) => {
        // verificar propriedades do link
        if (!link || !link.label) {
          console.error('NavLinks: link inválido no índice', index, link);
          return null;
        }

        const linkPath = `/${link.path}`;
        const isActive = activePath === linkPath;
        
        return (
          <NavButton
            key={link.label || index}
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

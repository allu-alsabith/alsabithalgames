import React from 'react';
import {
  Compass,
  Users,
  Sparkles,
  Zap,
  Sword,
  Flame,
  Ghost,
  Shield,
  Target,
  Castle,
  Cpu,
  BookOpen,
  Layers,
  Gamepad2,
  LucideProps,
} from 'lucide-react';

interface CategoryIconProps extends LucideProps {
  name: string;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, ...props }) => {
  switch (name) {
    case 'Compass':
      return <Compass {...props} />;
    case 'Users':
      return <Users {...props} />;
    case 'Sparkles':
      return <Sparkles {...props} />;
    case 'Zap':
      return <Zap {...props} />;
    case 'Sword':
      return <Sword {...props} />;
    case 'Flame':
      return <Flame {...props} />;
    case 'Ghost':
      return <Ghost {...props} />;
    case 'Shield':
      return <Shield {...props} />;
    case 'Target':
      return <Target {...props} />;
    case 'Castle':
      return <Castle {...props} />;
    case 'Cpu':
      return <Cpu {...props} />;
    case 'BookOpen':
      return <BookOpen {...props} />;
    case 'Layers':
      return <Layers {...props} />;
    default:
      return <Gamepad2 {...props} />;
  }
};

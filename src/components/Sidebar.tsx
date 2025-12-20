'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import {
  RiDashboardLine,
  RiBarChartLine,
  RiCalendarLine,
  RiMessage2Line,
  RiUserLine,
  RiBookLine,
  RiBuilding2Line,
  RiMoneyDollarCircleLine,
  RiQuestionLine,
  RiSettings4Line,
} from 'react-icons/ri';

interface MenuItem {
  name: string;
  icon: IconType;
  path: string;
  section?: string;
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: RiDashboardLine, path: '/dashboard' },
  { name: 'Analytics', icon: RiBarChartLine, path: '/analytics' },
  { name: 'Calendar', icon: RiCalendarLine, path: '/calendar' },
  { name: 'Messages', icon: RiMessage2Line, path: '/messages' },
  {
    name: 'Registration',
    icon: RiUserLine,
    path: '/registration',
    section: 'Academic Management',
  },
  { name: 'Students', icon: RiUserLine, path: '/students' },
  { name: 'Library', icon: RiBookLine, path: '/library' },
  { name: 'Courses', icon: RiBookLine, path: '/courses' },
  { name: 'Professors', icon: RiUserLine, path: '/professors' },
  { name: 'Department', icon: RiBuilding2Line, path: '/department' },
  {
    name: 'Financial Record',
    icon: RiMoneyDollarCircleLine,
    path: '/financial',
  },
  {
    name: 'Help & Center',
    icon: RiQuestionLine,
    path: '/help',
    section: 'Other Menu',
  },
  { name: 'Settings', icon: RiSettings4Line, path: '/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  let currentSection = '';

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0">
      <div className="p-4">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-purple-600 rounded"></div>
          <span className="text-xl font-semibold">Cudemo</span>
        </div>

        <nav>
          {menuItems.map((item, index) => {
            const showSection =
              item.section && currentSection !== item.section;
            currentSection = item.section || currentSection;

            return (
              <div key={index}>
                {showSection && (
                  <div className="text-xs text-gray-500 uppercase mt-6 mb-3 px-4">
                    {item.section}
                  </div>
                )}
                <Link
                  href={item.path}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-colors ${
                    pathname === item.path
                      ? 'bg-purple-50 text-purple-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
} 
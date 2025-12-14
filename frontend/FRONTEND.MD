# Optimus Lead Management Dashboard - Frontend Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Components](#components)
- [Pages](#pages)
- [State Management](#state-management)
- [API Integration](#api-integration)
- [Styling & Design](#styling--design)
- [Animations](#animations)
- [Utilities](#utilities)
- [Responsive Design](#responsive-design)
- [Performance Optimizations](#performance-optimizations)

---

## 🎯 Overview

The frontend is a **React 18** single-page application (SPA) built with **TypeScript** and **Tailwind CSS**. It provides an interactive, real-time dashboard for lead management with comprehensive analytics, KPI tracking, and performance visualizations.

**Key Features:**
- 📊 Real-time KPI cards with animated counters
- 📈 Interactive charts (Line, Bar, Donut)
- 🔍 Real-time search functionality
- 🎯 Multi-dimensional filtering
- 📱 Fully responsive (Desktop, Tablet, Mobile)
- 🎨 Advanced animations and transitions
- 📥 Export capabilities (JPEG, Excel)
- 🔔 Notification system
- 👤 User profile management

---

## 🏗️ Architecture

The frontend follows a **component-based architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         Presentation Layer              │
│  (React Components & UI)                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         State Management                │
│  (React Hooks, Context)                 │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│         API Layer                       │
│  (Fetch API, Data Transformation)       │
└─────────────────────────────────────────┘
```

**Design Patterns:**
- **Component Composition**: Reusable, modular components
- **Custom Hooks**: Shared business logic
- **Props Drilling**: Parent-to-child data flow
- **Lifting State Up**: Shared state management

---

## 🛠️ Tech Stack

### Core
- **React**: 19.2.1
- **TypeScript**: 4.9.5
- **React Router DOM**: 6.30.2

### Styling
- **Tailwind CSS**: 3.x (via CDN)
- **CSS Animations**: Keyframes and transitions

### Charting
- **Chart.js**: 4.5.1
- **react-chartjs-2**: 5.3.1

### Utilities
- **html2canvas**: 1.4.1 (Screenshot/export)
- **xlsx**: 0.18.5 (Excel export)

### Development
- **React Scripts**: 5.0.1
- **Testing Library**: React, Jest DOM, User Event

---

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html               # HTML entry point
│   ├── manifest.json            # PWA manifest
│   ├── robots.txt               # SEO robots file
│   ├── logo_sm.png              # Profile picture
│   └── favicon.ico              # Favicon
├── src/
│   ├── api/
│   │   ├── dashboardApi.ts      # Dashboard API calls
│   │   └── sessionApi.ts        # User session API calls
│   ├── components/
│   │   ├── ActionableInsights.tsx      # Recommendations panel
│   │   ├── AgentPerformanceChart.tsx   # Agent performance chart
│   │   ├── BannerMessage.tsx           # Top banner
│   │   ├── ChartsSection.tsx           # Charts container
│   │   ├── CustomSelect.tsx            # Custom dropdown
│   │   ├── DatePicker.tsx              # Date selector
│   │   ├── DonutChart.tsx              # Donut chart wrapper
│   │   ├── FilterBar.tsx               # Filter controls
│   │   ├── Footer.tsx                  # Page footer
│   │   ├── KpiCard.tsx                 # KPI metric card
│   │   ├── Layout.tsx                  # Main layout wrapper
│   │   ├── LineChart.tsx               # Line chart wrapper
│   │   ├── Logo.tsx                    # Brand logo
│   │   ├── MultiSelectCheckbox.tsx     # Multi-select dropdown
│   │   ├── Navbar.tsx                  # Top navigation
│   │   ├── NotificationBell.tsx        # Notifications dropdown
│   │   ├── ProfileDropdown.tsx         # User profile dropdown
│   │   ├── RankingsTable.tsx           # Rankings display
│   │   ├── RevenueTargetChart.tsx      # Revenue vs target chart
│   │   ├── SearchBar.tsx               # Search input
│   │   ├── Sidebar.tsx                 # Side navigation
│   │   └── TopAgentsPanel.tsx          # Top agents list
│   ├── hooks/
│   │   └── useDashboardData.ts  # Dashboard data fetching hook
│   ├── pages/
│   │   ├── Dashboard.tsx        # Main dashboard page
│   │   └── NotFound.tsx         # 404 page
│   ├── types/
│   │   ├── Dashboard.ts         # Dashboard type definitions
│   │   ├── Recommedation.ts     # Recommendation types
│   │   └── User.ts              # User types
│   ├── utils/
│   │   ├── downloadUtils.ts     # Export utilities
│   │   └── numberFormatter.ts   # Number formatting
│   ├── App.tsx                  # App root component
│   ├── App.css                  # Global styles
│   ├── index.tsx                # React DOM entry
│   ├── index.css                # Base CSS with Tailwind
│   └── react-app-env.d.ts       # TypeScript declarations
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.js           # Tailwind config
├── postcss.config.js            # PostCSS config
└── Dockerfile                   # Docker config
```

---

## 🧩 Components

### Core Layout Components

#### 1. **App.tsx**
Root component managing global state and routing.

```typescript
const App: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');

    return (
        <Router>
            <Layout searchQuery={searchQuery} onSearchChange={setSearchQuery}>
                <Routes>
                    <Route path="/" element={<Dashboard searchQuery={searchQuery} />} />
                    <Route path="/marketing" element={<MarketingPage />} />
                    <Route path="/campaigns" element={<CampaignsPage />} />
                    <Route path="/studio" element={<StudiosPage />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </Router>
    );
}
```

**Features:**
- Global search state management
- Route configuration
- Layout wrapper

---

#### 2. **Layout.tsx**
Main layout wrapper with navbar, sidebar, and banner.

**Props:**
```typescript
interface LayoutProps {
    children: React.ReactNode;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}
```

**Features:**
- Banner management (dynamic height calculation)
- Sidebar toggle functionality
- Active module tracking
- Responsive layout

**Layout Structure:**
```
┌─────────────────────────────────┐
│         Banner (Optional)       │
├─────────────────────────────────┤
│           Navbar                │
├──────┬──────────────────────────┤
│      │                          │
│ Side │     Main Content         │
│ bar  │     (Children)           │
│      │                          │
└──────┴──────────────────────────┘
```

---

#### 3. **Navbar.tsx**
Top navigation bar with search, notifications, and profile.

**Props:**
```typescript
interface NavbarProps {
    toggleSidebar: () => void;
    activeModule: 'lead' | 'marketing' | 'campaigns' | 'studio';
    setActiveModule: (module: ...) => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}
```

**Features:**
- Module navigation (Lead, Marketing, Campaigns, Studio)
- Integrated search bar
- Notification bell with unread count
- User profile dropdown
- Mobile hamburger menu

**Responsive Behavior:**
- **Desktop**: Full navigation with all modules
- **Mobile**: Hamburger menu, hidden module nav (shown in dashboard)

---

#### 4. **Sidebar.tsx**
Side navigation menu (currently minimal).

**Features:**
- Collapsible on mobile
- Overlay on small screens
- Menu items for app sections

---

#### 5. **BannerMessage.tsx**
Top banner for system-wide messages.

**Props:**
```typescript
interface BannerMessageProps {
    banner: IBanner;
}
```

**Features:**
- Fixed positioning
- HTML content support (dangerouslySetInnerHTML)
- Responsive text sizing
- Min height to accommodate content

---

### Navigation Components

#### 6. **SearchBar.tsx**
Reusable search input component.

**Props:**
```typescript
interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}
```

**Features:**
- Real-time search
- Clear button (X icon)
- Icon with magnifying glass
- Responsive sizing

---

#### 7. **NotificationBell.tsx**
Notification dropdown with unread count badge.

**Props:**
```typescript
interface NotificationBellProps {
    notifications: INotification[];
}
```

**Features:**
- Unread count badge
- Dropdown menu with notifications
- Click outside to close
- Read/unread styling
- Timestamp formatting

---

#### 8. **ProfileDropdown.tsx**
User profile menu.

**Props:**
```typescript
interface ProfileDropdownProps {
    userProfile: IUserProfile | null;
}
```

**Features:**
- Profile picture display
- User name and role
- Dropdown menu (View Profile, Settings, Sign Out)
- Click outside to close

---

### Filter & Control Components

#### 9. **FilterBar.tsx**
Comprehensive filter controls for dashboard data.

**Props:**
```typescript
interface FilterBarProps {
    availableBranches: IBranch[];
    availableUsers: IUser[];
    availableCampaigns: ICampaign[];
    availableSegments: ISegment[];
    availableProducts: IProduct[];
    onFilterChange: (filters: FilterState) => void;
}
```

**State:**
```typescript
interface FilterState {
    date: string;
    branchId: string;
    userId: string;
    campaignId: string;
    segmentId: string;
    productId: string;
}
```

**Features:**
- Date picker
- Branch selector
- User/Agent selector
- Campaign selector
- Segment selector
- Product selector
- Apply/Reset buttons
- Collapsible on mobile

**Responsive Behavior:**
- **Desktop**: Horizontal layout with all filters visible
- **Mobile**: Collapsible with toggle button

---

#### 10. **DatePicker.tsx**
Custom date input component.

**Features:**
- Native HTML5 date input
- Formatted display
- Default to today
- Configurable styling

---

#### 11. **CustomSelect.tsx**
Styled select dropdown.

**Features:**
- Custom styling
- Option mapping
- onChange handler
- Placeholder support

---

#### 12. **MultiSelectCheckbox.tsx**
Multi-select dropdown with checkboxes.

**Features:**
- Checkbox list
- Select/Deselect all
- Search within options
- Click outside to close
- Badge count display

---

### KPI & Metrics Components

#### 13. **KpiCard.tsx**
Animated KPI metric card.

**Props:**
```typescript
interface KpiCardProps {
    kpi: IKpiMetric;
}

interface IKpiMetric {
    id: string;
    label: string;
    value: string | number;
    previous_value: string | number;
    unit: string;
    change_percentage: number;
    change_direction: 'up' | 'down';
    color: string;
}
```

**Features:**
- Count-up animation (0 to value over 1 second)
- Spring-bounce entrance effect
- Pulse glow animation on circle
- Bouncing arrow indicators (up/down)
- Color-coded by metric type
- Hover effects (scale, shadow)

**Animations:**
```css
@keyframes slideInFromBottom {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulseGlow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(color, 0.4); }
  50% { box-shadow: 0 0 0 8px rgba(color, 0); }
}

@keyframes bounceUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}
```

---

### Chart Components

#### 14. **ChartsSection.tsx**
Container for status breakdown and revenue charts.

**Features:**
- Grid layout (2 charts)
- Donut chart for status breakdown
- Bar chart for revenue by product
- Line chart for 7-day revenue by branch

---

#### 15. **DonutChart.tsx**
Reusable donut chart wrapper for Chart.js.

**Props:**
```typescript
interface DonutChartProps {
    labels: string[];
    data: number[];
    colors: string[];
    title: string;
}
```

**Features:**
- Custom legend with count-first format ("50 Open")
- Center text display
- Responsive sizing
- Hover effects
- Legend click filtering

---

#### 16. **LineChart.tsx**
Reusable line chart wrapper.

**Features:**
- Multi-dataset support
- Gridlines
- Tooltips
- Legend
- Responsive

---

#### 17. **RevenueTargetChart.tsx**
Revenue vs target comparison chart with export.

**Features:**
- Dual-axis chart (target line + revenue bars)
- Branch filter dropdown
- 7-day data display
- Export to JPEG
- Export to Excel
- Loading states
- Empty state handling

**Export Functions:**
```typescript
const exportToJPEG = () => {
  html2canvas(chartRef.current).then(canvas => {
    const link = document.createElement('a');
    link.download = 'revenue-target-chart.jpg';
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
  });
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.aoa_to_sheet([
    ['Date', 'Target', 'Revenue'],
    ...data
  ]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Revenue vs Target');
  XLSX.writeFile(workbook, 'revenue-target-data.xlsx');
};
```

---

#### 18. **AgentPerformanceChart.tsx**
Agent revenue performance chart with export.

**Features:**
- Horizontal bar chart
- Agent comparison
- Export to JPEG
- Export to Excel
- Sorted by released amount

---

### Data Display Components

#### 19. **ActionableInsights.tsx**
Recommendations and rankings panel with gradient background.

**Features:**
- Three-column layout:
  1. **Recommendations** (AI-generated insights)
  2. **Branch Performance** (current branch stats)
  3. **Rankings** (branch & country position)
- Gradient background with shimmer animation
- Dividing lines between columns
- Staggered entrance animations (slideInFromLeft/Right)
- View Details buttons with hover effects

**Animations:**
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes slideInFromLeft {
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
}
```

---

#### 20. **RankingsTable.tsx**
Agent and country rankings display with tabs.

**Features:**
- Tab switching (Agent Ranking / Country Ranking)
- Rank display with trend indicators
- Current vs previous period comparison
- Scrollable content area
- Responsive layout

---

#### 21. **TopAgentsPanel.tsx**
Top 5 performing agents list.

**Features:**
- Compact card layout
- Agent name, TAT, conversion rate, branch
- Left-aligned content
- Scrollable on overflow
- Color-coded metrics

---

#### 22. **Footer.tsx**
Page footer with copyright and links.

---

#### 23. **Logo.tsx**
Brand logo component.

---

## 📄 Pages

### 1. **Dashboard.tsx**
Main dashboard page - orchestrates all components.

**Props:**
```typescript
interface DashboardProps {
    searchQuery?: string;
}
```

**State Management:**
```typescript
const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
const [activeModule, setActiveModule] = useState<'lead' | 'marketing' | 'campaigns' | 'studio'>('lead');
const [appliedFilters, setAppliedFilters] = useState<FilterState>({
    date: new Date().toISOString().split('T')[0],
    branchId: '',
    userId: '',
    campaignId: '',
    segmentId: '',
    productId: '',
});
```

**Data Flow:**
1. Fetch dashboard data via `useDashboardData` hook
2. Filter data based on `searchQuery`
3. Pass filtered data to child components

**Search Filtering Logic:**
```typescript
const filteredData = useMemo(() => {
    if (!data || !searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    
    return {
        ...data,
        kpi_metrics: kpi_metrics.filter(kpi => 
            kpi.label.toLowerCase().includes(query) ||
            kpi.value.toString().includes(query)
        ),
        recommendations: recommendations?.filter(rec => 
            rec.title?.toLowerCase().includes(query) ||
            rec.description?.toLowerCase().includes(query)
        ),
        branch_agent_rankings: branch_agent_rankings?.filter(agent => 
            agent.name?.toLowerCase().includes(query) ||
            agent.branch_name?.toLowerCase().includes(query)
        ),
        // ... more filters
    };
}, [data, searchQuery]);
```

**Layout:**
```
┌─────────────────────────────────────┐
│  Mobile Module Navigation           │
├─────────────────────────────────────┤
│  FilterBar                          │
├─────────────────────────────────────┤
│  KPI Cards Grid (5 cards)           │
├─────────────────────────────────────┤
│  Actionable Insights                │
├─────────────────────────────────────┤
│  Charts Section                     │
├─────────────────────────────────────┤
│  Revenue Target (2/3) | Rankings (1/3) │
├─────────────────────────────────────┤
│  Agent Chart (2/3) | Top Agents (1/3)  │
├─────────────────────────────────────┤
│  Footer                             │
└─────────────────────────────────────┘
```

---

### 2. **NotFound.tsx**
404 error page.

**Features:**
- Friendly error message
- Back to dashboard link
- Centered layout

---

## 🔄 State Management

### Global State
Managed at **App.tsx** level:
- `searchQuery`: Global search state

### Component State
Each component manages its own local state:
- Filter selections
- Dropdown open/close states
- Loading states
- Error states

### Data Fetching State
Managed by `useDashboardData` hook:
- `data`: Dashboard data
- `isLoading`: Loading indicator
- `error`: Error message
- `refreshData`: Manual refresh function

---

## 🌐 API Integration

### API Client Layer

#### **dashboardApi.ts**
Handles all dashboard-related API calls.

```typescript
const API_URL = "http://localhost:3000";
const API_VERSION = '/api/v1';

export async function fetchDashboardData(filters: Filters = {}): Promise<IDashboardData> {
    const url = new URL(`${API_URL}${API_VERSION}/dashboard`);
    
    // Add query parameters
    Object.keys(filters).forEach(key => {
        const value = filters[key];
        if (value !== undefined) {
            url.searchParams.append(key, String(value));
        }
    });
    
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
    }
    
    return await response.json() as IDashboardData;
}
```

---

#### **sessionApi.ts**
Handles user session API calls.

```typescript
export async function fetchUserProfile(): Promise<IUserProfile> {
    const response = await fetch(`${API_URL}${API_VERSION}/user`);
    if (!response.ok) throw new Error('Failed to fetch user profile');
    return await response.json();
}

export async function fetchNotifications(): Promise<INotification[]> {
    const response = await fetch(`${API_URL}${API_VERSION}/notifications`);
    if (!response.ok) throw new Error('Failed to fetch notifications');
    return await response.json();
}

export async function fetchBanner(): Promise<IBanner> {
    const response = await fetch(`${API_URL}${API_VERSION}/banner`);
    if (!response.ok) throw new Error('Failed to fetch banner');
    return await response.json();
}
```

---

### Custom Hooks

#### **useDashboardData.ts**
Custom hook for fetching and managing dashboard data.

```typescript
interface UseDashboardHook {
    data: IDashboardData | null;
    isLoading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

export function useDashboardData(filters: Filters): UseDashboardHook {
    const [data, setData] = useState<IDashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    
    const loadData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchDashboardData(filters);
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
            setData(null);
        } finally {
            setIsLoading(false);
        }
    }, [filters]);
    
    useEffect(() => {
        loadData();
    }, [loadData]);
    
    return { data, isLoading, error, refreshData: loadData };
}
```

**Features:**
- Automatic data fetching on filter changes
- Loading state management
- Error handling
- Manual refresh capability
- Memoized for performance

---

## 🎨 Styling & Design

### Design System

**Color Palette:**
```css
Primary: #5058FD (Indigo Blue)
Success: #10B981 (Green)
Warning: #F59E0B (Amber)
Error: #EF4444 (Red)
Background: #F1F5F8 (Light Gray)
Text: #1F2937 (Dark Gray)
```

**Typography:**
- Font Family: System fonts (sans-serif)
- Base Size: 16px
- Scale: xs, sm, base, lg, xl, 2xl, 3xl, 4xl

**Spacing:**
- Unit: 4px (0.25rem)
- Scale: 0, 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 32

**Border Radius:**
- sm: 4px
- md: 8px
- lg: 12px
- xl: 16px
- 2xl: 24px
- full: 9999px (circle)

---

### Tailwind CSS Utility Classes

**Common Patterns:**

```css
/* Card styling */
.card {
  @apply bg-white rounded-lg shadow-sm p-6;
}

/* Button styling */
.btn-primary {
  @apply bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition;
}

/* Responsive grid */
.grid-responsive {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

---

### Responsive Breakpoints

```
sm: 640px   (Small devices)
md: 768px   (Medium devices - tablets)
lg: 1024px  (Large devices - desktops)
xl: 1280px  (Extra large desktops)
2xl: 1536px (Ultra-wide screens)
```

---

## ✨ Animations

### CSS Keyframe Animations

#### KpiCard Animations
```css
@keyframes slideInFromBottom {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(80, 88, 253, 0.4);
  }
  50% {
    box-shadow: 0 0 0 8px rgba(80, 88, 253, 0);
  }
}

@keyframes dotPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.3); }
}

@keyframes bounceUp {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
}

@keyframes bounceDown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(3px); }
}
```

#### ActionableInsights Animations
```css
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes slideInFromLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInFromRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
```

### React Animation Patterns

#### Count-Up Animation
```typescript
useEffect(() => {
    let startValue = 0;
    const duration = 1000;
    const increment = finalValue / (duration / 16);
    
    const timer = setInterval(() => {
        startValue += increment;
        if (startValue >= finalValue) {
            setDisplayValue(finalValue);
            clearInterval(timer);
        } else {
            setDisplayValue(Math.floor(startValue));
        }
    }, 16);
    
    return () => clearInterval(timer);
}, [finalValue]);
```

---

## 🔧 Utilities

### **numberFormatter.ts**
Number formatting utilities.

```typescript
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('en-US').format(num);
};

export const formatCurrency = (num: number, currency: string = 'KES'): string => {
    return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: currency
    }).format(num);
};

export const formatPercentage = (num: number, decimals: number = 1): string => {
    return `${num.toFixed(decimals)}%`;
};
```

---

### **downloadUtils.ts**
Export functionality for charts and data.

```typescript
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

export const exportElementToJPEG = async (
    element: HTMLElement, 
    filename: string
): Promise<void> => {
    const canvas = await html2canvas(element);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/jpeg');
    link.click();
};

export const exportDataToExcel = (
    data: any[][], 
    sheetName: string, 
    filename: string
): void => {
    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, filename);
};
```

---

## 📱 Responsive Design

### Mobile-First Approach

**Strategy:**
1. Design for mobile first (320px+)
2. Add complexity for larger screens
3. Use Tailwind breakpoint prefixes

### Component Adaptations

#### Navbar
- **Mobile**: Hamburger menu, hidden module nav
- **Desktop**: Full navigation with all links

#### FilterBar
- **Mobile**: Collapsible, vertical layout
- **Desktop**: Horizontal layout, always visible

#### Dashboard Grid
- **Mobile**: Single column, stacked components
- **Tablet**: 2-column grid where appropriate
- **Desktop**: 3-column grid with 2/3 and 1/3 splits

#### Charts
- **Mobile**: Full width, reduced height
- **Desktop**: Optimized dimensions

### Responsive Patterns

```tsx
{/* Responsive grid */}
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
        {/* 2/3 width on desktop */}
    </div>
    <div className="lg:col-span-1">
        {/* 1/3 width on desktop */}
    </div>
</div>

{/* Conditional display */}
<div className="hidden md:block">
    {/* Desktop only */}
</div>

<div className="md:hidden">
    {/* Mobile only */}
</div>

{/* Responsive spacing */}
<div className="px-3 md:px-6 py-2 md:py-4">
    {/* Smaller padding on mobile */}
</div>
```

---

## ⚡ Performance Optimizations

### React Optimizations

#### 1. **useMemo**
Memoize expensive calculations:
```typescript
const filteredData = useMemo(() => {
    // Heavy filtering logic
    return processedData;
}, [data, searchQuery]);
```

#### 2. **useCallback**
Memoize callback functions:
```typescript
const loadData = useCallback(async () => {
    // API call
}, [filters]);
```

#### 3. **React.memo**
Prevent unnecessary re-renders:
```typescript
export default React.memo(KpiCard);
```

### Loading Strategies

#### 1. **Skeleton Screens**
```tsx
{isLoading && (
    <div className="animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
    </div>
)}
```

#### 2. **Lazy Loading**
```typescript
const HeavyComponent = React.lazy(() => import('./HeavyComponent'));

<Suspense fallback={<LoadingSpinner />}>
    <HeavyComponent />
</Suspense>
```

### Code Splitting
- Automatic code splitting via React Router
- Dynamic imports for heavy dependencies

### Bundle Optimization
- Tree-shaking unused code
- Minification in production
- Asset optimization (images, fonts)

---

## 🚀 Running the Frontend

### Development

```bash
cd frontend
npm install
npm start
```

Application runs on `http://localhost:3001`

### Production Build

```bash
npm run build
```

Creates optimized production build in `build/` directory.

### Docker

```bash
docker build -t frontend ./frontend
docker run -p 3001:3001 frontend
```

---

## 🧪 Testing

### Test Structure
```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   └── utils/
└── setupTests.ts
```

### Running Tests

```bash
npm test                 # Run tests in watch mode
npm test -- --coverage   # Generate coverage report
```

### Testing Libraries
- React Testing Library
- Jest
- User Event

---

## 🔐 Environment Variables

Create `.env` file in frontend root:

```env
REACT_APP_API_URL=http://localhost:3000
REACT_APP_API_VERSION=v1
```

---

## 📦 Build & Deployment

### Build for Production

```bash
npm run build
```

### Static File Serving
Serve the `build/` directory with any static file server:

```bash
npx serve -s build -l 3001
```

### Nginx Configuration
```nginx
server {
    listen 3001;
    root /path/to/build;
    
    location / {
        try_files $uri /index.html;
    }
}
```

---

## 🎯 Key Features Implemented

✅ **Real-time Search** - Filter data across all components  
✅ **Advanced Animations** - Count-up, spring-bounce, ripple effects  
✅ **Responsive Design** - Mobile, tablet, desktop optimized  
✅ **Interactive Charts** - Chart.js with custom configurations  
✅ **Export Functionality** - JPEG and Excel downloads  
✅ **Filter System** - Multi-dimensional data filtering  
✅ **Notification System** - Real-time alerts with unread counts  
✅ **User Management** - Profile display and session handling  
✅ **Performance Optimized** - Memoization, lazy loading, code splitting  
✅ **TypeScript** - Full type safety throughout  
✅ **Modular Components** - Reusable, composable architecture  

---

## 🔄 Future Enhancements

- [ ] Dark mode support
- [ ] PWA features (offline support, push notifications)
- [ ] Advanced filtering (date ranges, multi-select)
- [ ] Real-time updates (WebSocket integration)
- [ ] User preferences persistence
- [ ] A/B testing framework
- [ ] Analytics tracking
- [ ] Internationalization (i18n)
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] Performance monitoring (Web Vitals)
- [ ] E2E testing (Cypress/Playwright)
- [ ] Storybook component documentation

---

## 📚 Type Definitions

### Key Interfaces

```typescript
// Dashboard Data
interface IDashboardData {
    filters: IFilterOptions;
    kpi_metrics: IKpiMetric[];
    lead_vs_conversion: ILeadVsConversion;
    revenue_vs_target: IRevenueVsTarget;
    branch_agent_rankings: IBranchAgentRanking[];
    country_rankings: ICountryRankingItem[];
    agent_performance_released: IAgentPerformanceReleased[];
    top_performing_agents: ITopPerformingAgent[];
    transaction_list: ITransaction[];
    charts: ICharts;
    agent_performance: IAgentPerformance[];
    branch_performance: IBranchPerformance[];
    country_ranking: ICountryRanking[];
    recommendations: IRecommendation[];
    rankings: IRankings;
    summary: ISummary;
}

// KPI Metric
interface IKpiMetric {
    id: string;
    label: string;
    value: string | number;
    previous_value: string | number;
    unit: string;
    change_percentage: number;
    change_direction: 'up' | 'down';
    color: string;
}

// User Profile
interface IUserProfile {
    user_id: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    primary_branch_id: string;
}

// Notification
interface INotification {
    id: string;
    type: 'alert' | 'info';
    message: string;
    timestamp: string;
    read: boolean;
    link: string;
}
```

---

## 🛡️ Security Best Practices

### Implemented
- XSS protection via React's built-in escaping
- HTTPS-ready configuration
- Secure API communication
- Input validation

### Recommended for Production
- Content Security Policy (CSP)
- CORS configuration
- Rate limiting
- Authentication tokens
- Secure cookie handling
- Environment variable protection

---

## 📊 Performance Metrics

**Target Metrics:**
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1

**Optimization Techniques:**
- Code splitting
- Lazy loading
- Image optimization
- Memoization
- Virtual scrolling (for large lists)
- Debouncing search input

---

**Last Updated**: December 14, 2025  
**Version**: 1.0.0  
**Maintained by**: Ogilvy Africa Development Team

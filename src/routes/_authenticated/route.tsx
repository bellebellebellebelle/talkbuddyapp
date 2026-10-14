import { createFileRoute, Outlet, redirect, useLocation } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
export const Route=createFileRoute('/_authenticated')({ssr:false,beforeLoad:async()=>{const {data,error}=await supabase.auth.getUser();if(error||!data.user)throw redirect({to:'/auth'});return {user:data.user};},component:Layout});
function Layout(){const {pathname}=useLocation();if(pathname.startsWith('/ocktavus'))return <Outlet/>;return <div className="lab-theme min-h-screen"><Outlet/></div>;}

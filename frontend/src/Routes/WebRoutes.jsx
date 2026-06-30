import { Routes, Route, Navigate } from "react-router-dom";

import Main from "../component/Main";
import Layout from "../component/Layout";
import Rules from "../component/NavbarMenus/Rules";
import Registration from "../component/NavbarMenus/Registration";
import MatchingSearch from "../component/NavbarMenus/MatchinSearch";
import SingleIdSearch from "../component/NavbarMenus/SingleIdSearch";
import SearchResults from "../component/NavbarMenus/SearchResults";
import UnmarriedGrooms from "../component/Profile/UnmarriedGrooms";
import UnmarriedBrides from "../component/Profile/UnmarriedBrides";
import DivorcedGrooms from "../component/Profile/DivorsedGrooms";
import DivorcedBrides from "../component/Profile/DivorsedBridals";
import Login from "../component/Login/Login";
import RenewalPage from "../component/Login/RenewalPage";
import ContactUs from "../component/ContactUs";
import ProfileDetails from "../component/Profile/ProfileDetails";
import ProfileListPage from "../component/Profile/ProfileListPage";
import SuccessStories from "../component/NavbarMenus/SuccessStories";
import ToastContainer from "../component/ToastContainer";

import AdminLogin from "../admin/AdminLogin";
import AdminDashboard from "../admin/AdminDashboard";
import AdminProfiles from "../admin/AdminProfiles";
import AdminContacts from "../admin/AdminContacts";
import AdminNotifications from "../admin/AdminNotifications";
import AdminStats from "../admin/AdminStats";
import AdminLayout from "../admin/AdminLayout";
import RequireAdmin from "../admin/RequireAdmin";


function WebRoutes(){

return(
 <>
 <ToastContainer/>
 <Routes>

   {/* Admin area - outside the public Layout (no matrimonial navbar/footer) */}
   <Route path="/admin/login" element={<AdminLogin />} />
   <Route element={<RequireAdmin />}>
     <Route path="/admin" element={<AdminLayout />}>
       <Route index element={<Navigate to="/admin/dashboard" replace />} />
       <Route path="dashboard" element={<AdminStats />} />
       <Route path="payments" element={<AdminDashboard />} />
       <Route path="profiles" element={<AdminProfiles />} />
       <Route path="notifications" element={<AdminNotifications />} />
       <Route path="contacts" element={<AdminContacts />} />
     </Route>
   </Route>

   <Route path="/" element={<Layout />}>

      <Route index element={<Main />} />

    <Route path="rules" element={<Rules />} />
    <Route path="registration" element={<Registration />} />
     <Route path="search/matching" element={<MatchingSearch />} />
      <Route path="search/single-id" element={<SingleIdSearch />} />
      <Route path="search/results" element={<SearchResults />} />

      <Route path ="profile/unmarried-grooms" element ={<UnmarriedGrooms/>} />
      <Route path ="profile/unmarried-brides" element ={<UnmarriedBrides/>} />
      <Route path ="profile/divorsed/grooms" element ={<DivorcedGrooms/>} />
       <Route path ="profile/divorsed/brides" element ={<DivorcedBrides/>} />
       <Route path ="/login" element ={<Login/>} />
       <Route path ="/renewal" element ={<RenewalPage/>} />
       <Route path ="/contact-us" element ={<ContactUs/>} />
       <Route path ="accepted" element ={<ProfileListPage title="Accepted Profiles" mode="accepted" />} />
       <Route path ="success-stories" element ={<SuccessStories/>} />
        <Route path ="/profile-details" element ={<ProfileDetails/>} />

   </Route>

 </Routes>
 </>
)

}

export default WebRoutes;
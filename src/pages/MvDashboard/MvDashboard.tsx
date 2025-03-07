


// import MarketingManagerLayout from "../../layout/MarketingManagerLayout";
import MarketingCoordinatorLayout from "../../layout/MarketingCoordinatorLayout";
import AccountCreationForm from "../../components/MvAccountCreation/MvAccountCreation";
import {MvCard} from "../../components/MvCard/MvCard";
import MvSearchFilter from "../../components/MvSearchFilter/MvSearchFIlter";


const Dashboard = () => {
  
  return (
    <MarketingCoordinatorLayout>
      <MvSearchFilter/>
      <AccountCreationForm error=""/>
      <div className="contribution-list-view">
        <h2>Contribution List</h2>

        {/* Toggle View Button */}
        <div className="mb-4">
         
        </div>

       
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <MvCard></MvCard>
            <MvCard></MvCard>
            <MvCard></MvCard>
            <MvCard></MvCard>
            <MvCard></MvCard>
          </div>
              </div>
    </MarketingCoordinatorLayout>
  );
};

export default Dashboard;

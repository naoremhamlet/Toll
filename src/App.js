import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.css'
import "bootstrap-icons/font/bootstrap-icons.css";
import Header from './component/Header';
import BoothMaster from './component/Body/BoothMaster';
import CompanyName from './component/Body/CompanyName';
import TollName from './component/Body/TollName';
import JourneyMaster from './component/Body/JourneyMaster';
import VehicleMaster from './component/Body/VehicleMaster';
import TollPlazaFeeRules from './component/Body/TollPlazaFeeRules';
import Users from './component/Body/User';
import BoothTransaction from './component/Body/BoothTransaction';

function App() {
  const [active, setActive] = useState("boothtransaction");

  return (
    <div>
      <Header setActive={setActive} active={active} />
      {active==="boothtransaction" && <BoothTransaction />}
      {active==="boothmaster" && <BoothMaster />}
      {active==="companyname" && <CompanyName />}
      {active==="tollname" && <TollName />}
      {active==="journeymaster" && <JourneyMaster />}
      {active==="vehiclemaster" && <VehicleMaster />}
      {active==="tollplazafeerules" && <TollPlazaFeeRules />}
      {active==="users" && <Users />}
    </div>
  );
}

export default App;

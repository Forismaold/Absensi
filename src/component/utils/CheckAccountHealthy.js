import { useSelector } from "react-redux"

// const isAccountHealthy = (user) => {
//     if (!user.nama) return false;
//     if (!user.nomorAbsen || isNaN(user.nomorAbsen)) return false;
//     if (!user.kelas) return false;
//     if (!user.nomorKelas) return false;
  
//     return true; // All conditions satisfied
//   };

export default function CheckAccountHealthy() {
    const account = useSelector(state => state.source.account)

    if (!account) return

    if (account) {
        const missingFields = [
          !account.nama && "nama",
          !account.nomorAbsen && "nomorAbsen",
          !account.kelas && "kelas",
          !account.nomorKelas && "nomor urut kelas"
        ].filter(Boolean); // Filter out falsey values
      
        if (missingFields.length === 0) {
          // Account is healthy
          return null;
        }
      
        // Display warning if there are missing fields
        return (
          <div className="bg-yellow-500/50 p-2 py-6 rounded-md shadow-xl text-center pb-4">
            Akun tidak memiliki {missingFields.join(", ")}
          </div>
        );
      }
}

// Health-check function


// React function component
// const AccountHealthCheck = () => {
//   const healthy = isAccountHealthy(user); // Check health

//   return (
//     <div>
//       <h1>Account Health Check</h1>
//       <p>
//         Nama: <strong>{user.nama || "tidak ada"}</strong>
//       </p>
//       <p>
//         Nomor Absen: <strong>{user.nomorAbsen || "tidak ada"}</strong>
//       </p>
//       <p>
//         Kelas: <strong>{user.kelas || "tidak ada"}</strong>
//       </p>
//       <p>
//         Nomor Kelas: <strong>{user.nomorKelas || "tidak ada"}</strong>
//       </p>
//       <h2>
//         Account Status:{" "}
//         <span style={{ color: healthy ? "green" : "red" }}>
//           {healthy ? "Healthy" : "Not Healthy"}
//         </span>
//       </h2>
//     </div>
//   );
// };

// export default AccountHealthCheck;

# About the project
SomniaDonate is a decentralized donation platform built on Somnia testnet that uses an intelligent matching algorithm to connect donors with charities aligned to their values, ensuring complete transparency through blockchain technology and smart contracts.

# SomniaDonate - Decentralized Donation Platform

<div align="center">

![Somnia Donate](https://img.shields.io/badge/Somnia-Donate-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![Web3](https://img.shields.io/badge/Web3-Enabled-green?style=for-the-badge)

**A transparent, blockchain-powered crowdfunding platform built on Somnia network**

[Live Demo](https://somnia-donate.vercel.app/) • [Report Bug](https://github.com/simranjitsingh1337/somnia-donate/issues) • [Request Feature](https://github.com/simranjitsingh1337/somnia-donate/issues)

</div>

---

## 🌟 Overview

Somnia Donate is a Web3-powered crowdfunding platform that enables transparent, trustless donations through blockchain technology. Users can create fundraising campaigns, donate to causes they care about, and track all contributions with complete transparency on the Somnia blockchain.

### Why Somnia Donate?

- ✅ **100% Transparent** - All transactions recorded on-chain
- ✅ **No Middlemen** - Direct peer-to-peer donations
- ✅ **Low Fees** - Efficient Somnia blockchain
- ✅ **Global Access** - Anyone with a wallet can participate
- ✅ **Immutable Records** - Tamper-proof campaign data

---

## ✨ Key Features

### For Campaign Creators
- **Create Campaigns** - Launch fundraising with title, description, target amount, and deadline
- **Real-time Tracking** - Monitor donations and progress towards goals
- **Withdraw Funds** - Access raised funds directly to your wallet
- **Campaign Dashboard** - Manage and update campaign details

### For Donors
- **Browse Campaigns** - Explore active fundraising initiatives
- **Instant Donations** - Contribute using cryptocurrency via wallet
- **Transparent History** - View all donations and campaign progress
- **Blockchain Verification** - Verify every transaction on-chain

---

## 🛠 Technology Stack

**Frontend**
- Next.js 14 - React framework with App Router
- TypeScript - Type-safe development
- Tailwind CSS - Utility-first styling
- Shadcn/UI - Modern component library

**Web3 Integration**
- Ethers.js / Viem - Blockchain interaction
- Wagmi - React hooks for Ethereum
- RainbowKit / Web3Modal - Wallet connection
- Somnia Network - Layer-1 blockchain

**Deployment**
- Vercel - Frontend hosting
- IPFS (optional) - Decentralized storage

---

## 🏗 System Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph Client["Client Layer"]
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph Frontend["Frontend Application"]
        C[Next.js App]
        D[React Components]
        E[Tailwind CSS]
    end
    
    subgraph Web3["Web3 Layer"]
        F[Wagmi Hooks]
        G[Ethers.js/Viem]
        H[Wallet Provider]
    end
    
    subgraph Blockchain["Blockchain Layer"]
        I[Somnia Network]
        J[Smart Contract]
        K[Campaign Data]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    D --> F
    F --> G
    G --> H
    H --> I
    I --> J
    J --> K
    
    style Client fill:#e3f2fd
    style Frontend fill:#fff3e0
    style Web3 fill:#f3e5f5
    style Blockchain fill:#e8f5e9
```

### Application Flow

```mermaid
graph TB
    Start[User Visits Platform] --> Connect{Wallet Connected?}
    Connect -->|No| ConnectWallet[Connect Wallet Button]
    Connect -->|Yes| Dashboard[Main Dashboard]
    ConnectWallet --> WalletPrompt[MetaMask/Wallet Popup]
    WalletPrompt --> Dashboard
    
    Dashboard --> Action{Choose Action}
    
    Action -->|Create Campaign| CreateFlow[Create Campaign Form]
    Action -->|Browse Campaigns| BrowseFlow[Campaign List Page]
    Action -->|My Campaigns| ManageFlow[My Campaigns Dashboard]
    
    CreateFlow --> FillForm[Fill Campaign Details]
    FillForm --> SubmitCreate[Submit to Blockchain]
    
    BrowseFlow --> ViewCampaigns[View All Campaigns]
    ViewCampaigns --> SelectCampaign[Select a Campaign]
    SelectCampaign --> DonateForm[Enter Donation Amount]
    DonateForm --> SubmitDonate[Submit Donation]
    
    ManageFlow --> ViewMyCampaigns[View My Campaigns]
    ViewMyCampaigns --> ManageActions{Manage Options}
    ManageActions -->|Withdraw| WithdrawFunds[Withdraw Raised Funds]
    ManageActions -->|Update| UpdateCampaign[Update Campaign Info]
    
    SubmitCreate --> Blockchain[Somnia Blockchain]
    SubmitDonate --> Blockchain
    WithdrawFunds --> Blockchain
    UpdateCampaign --> Blockchain
    
    Blockchain --> Confirm[Transaction Confirmation]
    Confirm --> Success[Update UI & Show Success]
    Success --> Dashboard
    
    style Start fill:#bbdefb
    style Dashboard fill:#c5e1a5
    style Blockchain fill:#ffcc80
    style Success fill:#a5d6a7
```

### Donation Process Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Frontend UI
    participant Wagmi as Wagmi/Web3
    participant Wallet as User Wallet
    participant Somnia as Somnia Blockchain
    participant Contract as Smart Contract
    
    User->>UI: Open Platform
    UI->>Wagmi: Check Wallet Connection
    Wagmi->>Wallet: Request Connection
    Wallet->>User: Approve Connection?
    User->>Wallet: Approve
    Wallet->>Wagmi: Connected
    Wagmi->>UI: Wallet Address
    
    User->>UI: Browse Campaigns
    UI->>Contract: Fetch All Campaigns
    Contract->>Somnia: Query Blockchain
    Somnia->>Contract: Return Data
    Contract->>UI: Campaign List
    UI->>User: Display Campaigns
    
    User->>UI: Select Campaign
    UI->>User: Show Campaign Details
    User->>UI: Enter Donation Amount
    UI->>Wagmi: Prepare Transaction
    Wagmi->>Wallet: Request Signature
    Wallet->>User: Confirm Transaction?
    User->>Wallet: Confirm
    Wallet->>Somnia: Send Transaction
    Somnia->>Contract: Execute Donation
    Contract->>Somnia: Update State
    Somnia->>Wallet: Transaction Hash
    Wallet->>Wagmi: Success
    Wagmi->>UI: Transaction Confirmed
    UI->>User: Show Success Message
```

### Data Flow Architecture

```mermaid
graph TB
    subgraph User Interface
        A[Campaign List Page]
        B[Campaign Detail Page]
        C[Create Campaign Page]
        D[User Dashboard]
    end
    
    subgraph State Management
        E[React State]
        F[Wagmi Cache]
    end
    
    subgraph Web3 Layer
        G[Read Functions]
        H[Write Functions]
        I[Event Listeners]
    end
    
    subgraph Blockchain
        J[Campaign Contract]
        K[Transaction Pool]
        L[Blockchain State]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> F
    F --> G
    F --> H
    F --> I
    
    G --> J
    H --> K
    I --> J
    
    K --> L
    J --> L
    L --> J
    
    style User Interface fill:#e1f5fe
    style State Management fill:#f3e5f5
    style Web3 Layer fill:#fff9c4
    style Blockchain fill:#c8e6c9
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- MetaMask or compatible Web3 wallet
- Basic understanding of cryptocurrency

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/simranjitsingh1337/somnia-donate.git
cd somnia-donate
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
  - Create a **.env.local** file
```env
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address
NEXT_PUBLIC_SOMNIA_RPC_URL=your_rpc_url
NEXT_PUBLIC_CHAIN_ID=your_chain_id
```

4. **Run Development Server**
```bash
npm run dev
```

5. **Open Browser**
```text
Navigate to http://localhost:3000
```

## 📖 Usage Guide

### Creating a Campaign

1. Connect your Web3 wallet (MetaMask recommended)
2. Click "Create Campaign" button
3. Fill in campaign details:
   - Campaign title
   - Detailed description
   - Target funding amount
   - Campaign deadline
4. Submit and confirm the transaction in your wallet
5. Share your campaign link with supporters

### Making a Donation

1. Browse available campaigns on the homepage
2. Click on a campaign to view details
3. Enter your donation amount
4. Confirm the transaction in your wallet
5. Receive confirmation and transaction hash

### Managing Campaigns

Campaign owners can:
- View real-time donation statistics
- Track progress towards funding goals
- Withdraw collected funds after reaching milestones
- Update campaign information as needed

---

## 🤝 Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Ensure code is properly formatted
- Test thoroughly before submitting PR
- Update documentation for new features
- Write clear commit messages

---

## 🔒 Security

- Never share private keys or seed phrases
- Test on testnet before mainnet deployment
- Verify all transactions before confirming
- Report security issues responsibly
- Use environment variables for sensitive data

---

## 🐛 Known Issues

- None currently reported

Found a bug? Please [open an issue](https://github.com/simranjitsingh1337/somnia-donate/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Somnia Network](https://somnia.network/) for blockchain infrastructure
- [Shadcn/UI](https://ui.shadcn.com/) for beautiful UI components
- [Wagmi](https://wagmi.sh/) for Web3 React hooks
- [Vercel](https://vercel.com/) for hosting platform
- The Web3 community for continuous support and inspiration

---

## 📞 Contact

**Simranjit Singh**

- GitHub: [@simranjitsingh1337](https://github.com/simranjitsingh1337)
- Project Link: [https://github.com/simranjitsingh1337/somnia-donate](https://github.com/simranjitsingh1337/somnia-donate)
- Live Demo: [https://somnia-donate.vercel.app/](https://somnia-donate.vercel.app/)

---

## ⭐ Support

If you find this project helpful, please consider giving it a star on GitHub!

---

<div align="center">

**Made with ❤️ by [Simranjit Singh](https://github.com/simranjitsingh1337)**

</div>

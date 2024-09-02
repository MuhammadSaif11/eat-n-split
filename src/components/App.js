import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showFriendForm, setShowFriendForm] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleClick = () => {
    setShowFriendForm((val) => !val);
  };

  const handleFormSubmit = (friend) => {
    setFriends((friends) => [...friends, friend]);
    handleClick();
  };

  const handleSplitBillForm = (balance) => {
    setFriends((f) =>
      f.map((f) =>
        f.id === selectedFriend.id ? { ...f, balance: f.balance + balance } : f
      )
    );
    setSelectedFriend(null);
  };

  const handleSelect = (friend) => {
    setSelectedFriend((f) => (f?.id === friend?.id ? null : friend));
    setShowFriendForm(false);
  };

  return (
    <div className="app">
      <div className="sidebar">
        <Friends
          friends={friends}
          setSelectedFriend={handleSelect}
          selectedFriend={selectedFriend}
        />
        {showFriendForm && <FormAddFriend onSubmit={handleFormSubmit} />}
        <Button onClick={handleClick}>
          {showFriendForm ? "close" : "Add Friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSubmit={handleSplitBillForm}
        />
      )}
    </div>
  );
};

const Friends = ({ friends, setSelectedFriend, selectedFriend }) => {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          setSelectedFriend={setSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
};

const Friend = ({ friend, setSelectedFriend, selectedFriend }) => {
  return (
    <li className={selectedFriend?.id === friend.id ? "selected" : null}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${friend.balance}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onClick={() => setSelectedFriend(friend)}>
        {selectedFriend?.id === friend.id ? "close" : "select"}
      </Button>
    </li>
  );
};

const Button = ({ children, onClick }) => {
  return (
    <button type="submit" className="button" onClick={onClick}>
      {children}
    </button>
  );
};

const FormAddFriend = ({ onSubmit }) => {
  const [friendName, setFriendName] = useState("");
  const [url, setUrl] = useState("https://i.pravatar.cc/48");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!friendName || !url) return;

    const id = crypto.randomUUID();
    const friend = {
      id,
      name: friendName,
      image: `${url}?=${id}`,
      balance: 0,
    };
    onSubmit(friend);
    setFriendName("");
    setUrl("https://i.pravatar.cc/48");
  };

  return (
    <form className="form-add-friend" onSubmit={handleFormSubmit}>
      <label>👫Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName((val) => e.target.value)}
      />

      <label>🤵Image Url</label>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl((val) => e.target.value)}
      />

      <Button>Add</Button>
    </form>
  );
};

const FormSplitBill = ({ selectedFriend, onSubmit }) => {
  const [billValue, setBillValue] = useState("");
  const [userExpense, setUserExpense] = useState("");
  const [billPayer, setBillPayer] = useState("user");

  const handleForm = (e) => {
    e.preventDefault();

    if (!billValue || userExpense === "") return;

    const balance =
      billPayer === "user" ? billValue - userExpense : -userExpense;

    onSubmit(balance);

    setBillValue("");
    setUserExpense("");
    setBillPayer("user");
  };

  return (
    <form className="form-split-bill" onSubmit={handleForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <label>💵Bill value</label>
      <input
        type="text"
        value={billValue}
        onChange={(e) => setBillValue((val) => Number(e.target.value))}
      />
      <label>🤵Your expense</label>
      <input
        type="text"
        value={userExpense}
        onChange={(e) =>
          setUserExpense((val) =>
            Number(e.target.value) > billValue ? val : Number(e.target.value)
          )
        }
      />
      <label>👫{selectedFriend.name}'s expense</label>
      <input
        type="text"
        value={billValue ? billValue - userExpense : ""}
        disabled
      />
      <label>🤑Who is paying the bill?</label>
      <select
        value={billPayer}
        onChange={(e) => setBillPayer((val) => e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split bill</Button>
    </form>
  );
};

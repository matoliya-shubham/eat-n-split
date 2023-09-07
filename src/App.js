import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
    selected: false,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
    selected: false,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
    selected: false,
  },
];
export default function App() {
  const [isOpenAddFriendForm, setIsOpenAddFriendForm] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleAddFriend(newEntry) {
    setFriendList((friendList) => [
      ...friendList,
      { ...newEntry, id: Date.now() },
    ]);
  }

  function handleToggle() {
    setIsOpenAddFriendForm((isOpenAddFriendForm) => !isOpenAddFriendForm);
  }

  function handleSelected(item) {
    setSelectedFriend((selected) => (selected?.id === item.id ? null : item));
    setIsOpenAddFriendForm(false);
  }

  function handleUpdateBalance(id, balance) {
    setFriendList((friendList) =>
      friendList.map((friend) =>
        friend.id === id
          ? { ...friend, balance: friend.balance + balance }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          onSelect={handleSelected}
          selectedFriend={selectedFriend}
        />
        <FormAddFriend
          open={isOpenAddFriendForm}
          onAddFriend={handleAddFriend}
        />
        <Button onClick={handleToggle}>
          {isOpenAddFriendForm ? `close` : `Add Friend`}
        </Button>
      </div>
      {selectedFriend && (
        <FormSplitBill
          key={selectedFriend.id}
          selectedItem={selectedFriend}
          onSplit={handleUpdateBalance}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onSelect={onSelect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelect, selectedFriend }) {
  const isSelected = selectedFriend?.id == friend.id;
  // const isSelected = false;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} {friend.balance}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} ows you {Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}
      <Button
        onClick={isSelected ? () => onSelect(friend) : () => onSelect(friend)}
      >
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ open, onAddFriend }) {
  const [newEntry, setNewEntry] = useState({
    name: "",
    image: "",
    balance: 0,
    selected: false,
  });
  function handleAddEntry(e) {
    e.preventDefault();
    onAddFriend(newEntry);
    setNewEntry({
      name: "",
      image: "",
      balance: 0,
    });
  }
  {
    return (
      open && (
        <form className="form-add-friend" onSubmit={handleAddEntry}>
          <label>Friend Name</label>
          <input
            type="text"
            required
            value={newEntry.name}
            onChange={(e) => setNewEntry({ ...newEntry, name: e.target.value })}
          />
          <label>Image URL</label>
          <input
            type="text"
            required
            value={newEntry.image}
            onChange={(e) =>
              setNewEntry({ ...newEntry, image: e.target.value })
            }
          />
          <Button type="submit">Add</Button>
        </form>
      )
    );
  }
}

function FormSplitBill({ selectedItem, onSplit }) {
  const [formEntry, setFormEntry] = useState({
    billValue: 0,
    Y_expense: 0,
    X_expense: 0,
    paidBy: "You",
  });
  function handleSubmit(e) {
    e.preventDefault();
    if (formEntry.paidBy === "You")
      onSplit(selectedItem.id, formEntry.X_expense);
    else onSplit(selectedItem.id, -formEntry.Y_expense);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>split bill with {selectedItem.name}</h2>
      <label>Bill value </label>
      <input
        required
        type="number"
        value={formEntry.billValue}
        onChange={(e) =>
          setFormEntry({
            ...formEntry,
            billValue: e.target.value,
          })
        }
      />
      <label>Your expense</label>
      <input
        required
        type="number"
        value={formEntry.Y_expense}
        onChange={(e) =>
          setFormEntry({
            ...formEntry,
            Y_expense: e.target.value,
            X_expense: eval(formEntry.billValue - e.target.value),
          })
        }
      />
      <label>{selectedItem.name} expense</label>
      <input type="number" value={formEntry.X_expense} disabled />
      <label>Who is paying the bill</label>
      <select
        required
        onChange={(e) => setFormEntry({ ...formEntry, paidBy: e.target.value })}
      >
        <option value={"You"}>You</option>
        <option value={"friend"}>{selectedItem.name}</option>
      </select>
      <Button type="submit">Split Bill</Button>
    </form>
  );
}

function Button({ children, onClick, type }) {
  return (
    <button type={type} className="button" onClick={onClick}>
      {children}
    </button>
  );
}

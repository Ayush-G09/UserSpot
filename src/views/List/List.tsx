import {
  faAngleLeft,
  faAngleRight,
  faCaretDown,
  faCaretUp,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../axios/axiosInstance";
import Label from "../../components/Label";
import SearchAndFilterPanel from "./components/SearchAndFilterPanel";
import UserCard from "./components/UserCard";
import { addUsers } from "../../store/action";
import { RootState } from "../../store/store";
import { User } from "../../types";
import styled from "styled-components";
import { DotLoader } from "react-spinners";

const fetchUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/users");
  return response.data;
};

type State = {
  users: User[];
  pageData: User[];
  currentPage: number;
  totalPage: number;
  showItems: number;
  searchQuery: string;
  filterOpen: boolean;
  filterData: string[];
  sortData: {
    name: 0 | 1 | 2;
    email: 0 | 1 | 2;
  };
};

function List() {
  const dispatch = useDispatch();
  const orgData = useSelector((state: RootState) => state.users);
  const mode = useSelector((state: RootState) => state.mode);

  const { data, isLoading, error } = useQuery<User[], Error>({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  const [state, setState] = useState<State>({
    users: [],
    pageData: [],
    currentPage: 1,
    totalPage: 0,
    showItems: 5,
    searchQuery: "",
    filterOpen: false,
    filterData: [],
    sortData: { name: 1, email: 1 },
  });

  const getUsers = useCallback(() => {
    const startIndex = (state.currentPage - 1) * state.showItems;
    const endIndex = startIndex + state.showItems;
    return state.users.slice(startIndex, endIndex);
  }, [state.currentPage, state.showItems, state.users]);

  const searchUsers = useCallback(() => {
    const lowercasedQuery = state.searchQuery.toLowerCase();
    return orgData.filter(
      (user) =>
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.company.name.toLowerCase().includes(lowercasedQuery)
    );
  }, [state.searchQuery, orgData]);

  useEffect(() => {
    if (data && !orgData.length) {
      setState((prev) => ({
        ...prev,
        users: data,
        totalPage: Math.ceil(data.length / state.showItems),
        pageData: data,
      }));
      dispatch(addUsers(data));
    } else {
      const pageData = getUsers();
      setState((prev) => ({
        ...prev,
        users: orgData,
        totalPage: Math.ceil(orgData.length / state.showItems),
        pageData: pageData,
      }));
    }
  }, [data, orgData]);

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      totalPage: Math.ceil(state.users.length / state.showItems),
    }));
    if (state.currentPage > Math.ceil(state.users.length / state.showItems)) {
      setState((prev) => ({ ...prev, currentPage: 1 }));
    }
  }, [state.showItems]);

  useEffect(() => {
    const data = getUsers();
    setState((prev) => ({ ...prev, pageData: data }));
  }, [state.currentPage, state.totalPage, state.showItems, state.users]);

  useEffect(() => {
    let filteredUser: User[] = [];

    // If searchQuery is present, perform the search
    if (state.searchQuery.trim()) {
      filteredUser = searchUsers();
    } else {
      // Use the original dataset when searchQuery is empty
      filteredUser = orgData; // Use orgData instead of users to reset to the original data
    }

    // If there are filter criteria in filterData, apply the filters
    if (state.filterData.length) {
      const newUsers = filteredUser.filter((user) => {
        return state.filterData.some((data) => {
          const cityMatch = user.address?.city
            ?.toLowerCase()
            .includes(data.toLowerCase());
          const companyMatch = user.company?.name
            ?.toLowerCase()
            .includes(data.toLowerCase());
          return cityMatch || companyMatch;
        });
      });

      // Ensure uniqueness based on user.id, and handle type of 'id'
      filteredUser = Array.from(
        new Set(newUsers.map((user) => user.id)) // Use user.id for uniqueness
      ).map((id) => {
        return newUsers.find((user) => user.id === id);
      }) as User[];
    }

    // Set the filtered users or revert to the original data
    if (
      filteredUser.length > 0 ||
      state.searchQuery.trim() ||
      filteredUser.length > 0
    ) {
      setState((prev) => ({
        ...prev,
        users: filteredUser,
        totalPage: Math.ceil(filteredUser.length / state.showItems),
      }));
      if (
        state.currentPage > Math.ceil(filteredUser.length / state.showItems)
      ) {
        setState((prev) => ({ ...prev, currentPage: 1 }));
      }
    } else {
      setState((prev) => ({
        ...prev,
        users: orgData,
        totalPage: Math.ceil(orgData.length / state.showItems),
      }));
      if (state.currentPage > Math.ceil(orgData.length / state.showItems)) {
        setState((prev) => ({ ...prev, currentPage: 1 }));
      }
    }
  }, [state.searchQuery, state.filterData]);

  const changePage = (value: number) => {
    setState((prev) => ({ ...prev, currentPage: state.currentPage + value }));
  };

  useEffect(() => {
    const filterCon = document.getElementById("filter-con");
    const filter = document.getElementById("filter");

    // Update filter container styles
    if (filterCon) {
      filterCon.style.visibility = state.filterOpen ? "visible" : "hidden";
      filterCon.style.opacity = state.filterOpen ? "1" : "0";
      filterCon.style.transform = state.filterOpen ? "scaleY(1)" : "scaleY(0)";
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterCon &&
        !filterCon.contains(event.target as Node) &&
        filter &&
        !filter.contains(event.target as Node)
      ) {
        setState((prev) => ({ ...prev, filterOpen: false }));
      }
    };

    if (state.filterOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [state.filterOpen]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setState((prev) => ({
      ...prev,
      filterData: prev.filterData.includes(value)
        ? prev.filterData.filter((item) => item !== value)
        : [...prev.filterData, value],
    }));
  };

  const toggleSort = (field: "name" | "email") => {
    setState((prev) => ({
      ...prev,
      sortData: {
        ...prev.sortData,
        [field]: prev.sortData[field] === 2 ? 0 : prev.sortData[field] + 1,
      },
    }));
  };

  useEffect(() => {
    const sortUsers = () => {
      if (state.users.length) {
        let sortedUsers = [...state.users]; // Create a copy to avoid mutating the original array

        // Sort by name if needed
        if (state.sortData.name === 0) {
          sortedUsers.sort((a, b) => b.name.localeCompare(a.name)); // Descending
        } else if (state.sortData.name === 2) {
          sortedUsers.sort((a, b) => a.name.localeCompare(b.name)); // Ascending
        }

        // Sort by email if needed
        if (state.sortData.email === 0) {
          sortedUsers.sort((a, b) => b.email.localeCompare(a.email)); // Descending
        } else if (state.sortData.email === 2) {
          sortedUsers.sort((a, b) => a.email.localeCompare(b.email)); // Ascending
        }

        // Update the state
        setState((prev) => ({ ...prev, users: sortedUsers }));
      }
    };

    sortUsers();
  }, [state.sortData]);

  if (isLoading)
    return (
      <Container style={{ justifyContent: "center" }}>
        <DotLoader color="#0288d1" />
      </Container>
    );
  if (error instanceof Error)
    return (
      <Container style={{ justifyContent: "center" }}>
        <Label sx={{ color: "red" }}>Error: {error.message}</Label>
      </Container>
    );
  return (
    <Container>
      <SearchAndFilterPanel
        searchQuery={state.searchQuery}
        setSearchQuery={(e) =>
          setState((prev) => ({ ...prev, searchQuery: e }))
        }
        setShowItems={(e) => setState((prev) => ({ ...prev, showItems: e }))}
        showItems={state.showItems}
        setFilterOpen={(e) => setState((prev) => ({ ...prev, filterOpen: e }))}
        filterOpen={state.filterOpen}
        handleFilterChange={handleFilterChange}
        orgData={state.users}
        filterData={state.filterData}
      />
      <ListContent>
        <Header>
          <HeaderItem width={"22%"}>
            <Label sx={{ color: "gray" }}>Name</Label>
            <FontAwesomeIcon
              onClick={() => toggleSort("name")}
              icon={
                state.sortData.name === 0
                  ? faCaretDown
                  : state.sortData.name === 1
                  ? faMinus
                  : faCaretUp
              }
              style={{
                marginLeft: "auto",
                color:
                  state.sortData.name === 0
                    ? "red"
                    : state.sortData.name === 1
                    ? "gray"
                    : "green",
                cursor: "pointer",
              }}
            />
          </HeaderItem>
          <HeaderItem width={"23%"}>
            <Label sx={{ color: "gray" }}>Email</Label>
            <FontAwesomeIcon
              onClick={() => toggleSort("email")}
              icon={
                state.sortData.email === 0
                  ? faCaretDown
                  : state.sortData.email === 1
                  ? faMinus
                  : faCaretUp
              }
              style={{
                marginLeft: "auto",
                color:
                  state.sortData.email === 0
                    ? "red"
                    : state.sortData.email === 1
                    ? "gray"
                    : "green",
                cursor: "pointer",
              }}
            />
          </HeaderItem>
          <Label sx={{ color: "gray", width: "34%" }}>Address</Label>
          <Label sx={{ color: "gray", width: "18%" }}>Company</Label>
        </Header>
        {state.pageData.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ListContent>
      <Footer>
        <PaginationContainer>
          <PaginationButton
            onClick={() => changePage(-1)}
            style={{
              pointerEvents: state.currentPage <= 1 ? "none" : "auto",
              borderRight: `3px solid ${
                mode === "light" ? "#d2d3db" : "#252526"
              }`,
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} />
            {state.currentPage <= 1 && (
              <Label>
                {state.currentPage} OF {state.totalPage}
              </Label>
            )}
          </PaginationButton>
          <PaginationButton
            onClick={() => changePage(1)}
            style={{
              pointerEvents:
                state.currentPage < state.totalPage ? "auto" : "none",
            }}
          >
            {state.currentPage > 1 && (
              <Label>
                {state.currentPage} OF {state.totalPage}
              </Label>
            )}
            <FontAwesomeIcon icon={faAngleRight} />
          </PaginationButton>
        </PaginationContainer>
      </Footer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ListContent = styled.div`
  width: 85%;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding-bottom: 50px;
  padding-top: 10px;
  overflow-y: scroll;
  align-items: center;
  margin-top: 0.5rem;

  @media (min-width: 900px) {
    margin-top: 0;
  }
`;

const Header = styled.div`
  width: 100%;
  padding: 0.5rem 0;
  display: none;
  align-items: center;

  @media (min-width: 1100px) {
    display: flex;
  }
`;

const HeaderItem = styled.div<{ width: string }>`
  width: ${(props) => props.width};
  display: flex;
  align-items: center;
  padding-right: 1rem;
  box-sizing: border-box;
`;

const Footer = styled.div`
  width: 85%;
  min-height: 9%;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 3rem;
`;

const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  color: ${(p) => p.theme.font};
  border-radius: 20px;
  overflow: hidden;
  background-color: ${(p) => p.theme.secondary};
  box-shadow: ${(p) => p.theme.shadow};
`;

const PaginationButton = styled.div`
  padding: 0.3rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

export default List;

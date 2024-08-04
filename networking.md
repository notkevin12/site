---
layout: default
katex: true
---

# Networking Glossary

- [Internet Protocol Stack](#internet-protocol-stack)
- [Network Security](#network-security)
- [Network Applications](#network-applications)
- [Transport Protocols](#transport-protocols)
- [The Data Plane](#the-data-plane)

---

## Internet Protocol Stack

__Application layer__ is where network applications transmit __messages__

- Includes protocols like HTTP (Hypertext Transfer Protocol), SMTP (Simple Mail Transfer Protocol), FTP (File Transfer Protocol)

__Transport layer__ transmits __segments__ between application endpoints

- Packet flow: matching sender/receiver packet transmission rate
- Congestion control: throttling transmission rate when network is congested
- TCP protocol operates by connections, can guarantee delivery and control packet flow and congestion
- UDP protocol is connectionless and makes no promises: no guaranteed delivery or order of arrival, no flow control, no congestion control

__Network layer__ routes __datagrams__ through the network between hosts

- The Internet Protocol defines datagram fields and how end systems and routers process datagrams
- Routing protocols determine the routes datagrams travel between hosts

__Link layer__ is responsible for delivering __frames__ across network links

- Different links use different protocols, e.g. Ethernet and WiFi

__Physical layer__ is responsible for delivering individual __bits__ across link medium

- Different mediums use different protocols, e.g. copper wire, fiber optics

## Network Security

__Denial-of-Service (DoS)__ attacks prevent users from using some network application

- Vulnerability attack: information on packets takes advantage of an application exploit
- Bandwidth flooding: so many packets are sent that congestion blocks legitimate traffic
- Connection flooding: many TCP connections are held at once, preventing new connections from being made with legitimate users

In __Distributed-Denial-of-Service (DDoS)__ attacks, multiple sources produce malicious traffic -- harder to detect and block than a single source

__Secure Sockets Layer (SSL)__ provides encryption, data integrity, authentication services on top of TCP

## Network Applications

__Client-Server Architecture__: always-on host, called a __server__, services requests from __client__ hosts

- Server IP is well-known for all clients to connect to
- No need for clients to communicate

__Peer-to-Peer (P2P) Architecture__: direct communication between clients

- Self-scaling: each peer adds service capacity
- Cost-effective: no need to maintain server infrastructure
- __BitTorrent:__
  - Collection of peers distributing a file is called a __torrent__
  - Rarest first requests: peers will request for chunks of the file that are most uncommon among their neighboring peers
  - Tit-for-tat trading: peers prioritze sending data to the neighbors that send data at higher rates
  - An additional neighbor is randomly chosen at regular intervals to receive data (so new peers may receive chunks to trade)

__Sockets__ deliver messages between application __processes__ and the transport layer

__IP addresses__ identify hosts, __port numbers__ identify processes on a host -- need to know both to determine where messages are sent/received

__Hypertext Transfer Protocol (HTTP)__ is an application-layer protocol for accessing web pages

- HTTP is based on TCP, uses port `80` by default
- HTTP is stateless, rerequesting the same page will resend the entire HTML document
- Method field: `GET` (request), `POST` (form input), `HEAD` (debugging), `PUT` (upload), `DELETE` (delete)
- Status codes: `200` (OK), `301` (object moved), `400` (bad request), `404` (object not found), `505` (incompatible version)

__Cookies__ consist of...

1. Cookie header line in HTTP response/request messages
2. Local file on client machine, managed by browser
3. Database entry that stores information associated with the cookie

HTTP requests may direct to a __web cache (proxy server)__ instead of origin server

- Caching requested objects reduces client response time and reduces overall web traffic
- Content Distribution Networks (CDN) install many caches to geographically localize traffic and reduce service latency
- Cluster selection strategies:
  - Geographically closest: CDN directs DNS request to the cluster closest to the requesting host
  - Better: perform periodic measurements of network traffic conditions to determine best cluster

__Domain Name System (DNS)__ is a distributed database mapping hostnames to IP addresses

- DNS is based on UDP, uses port `53` by default
- Supports host aliasing, e.g. `enterprise.com` instead of `relay1.west-coast.enterprise.com`
- Load distributing: DNS may distribute traffic for a single hostname among a set of replicated server IP addresses
- DNS hierarchy: root servers >> top-level domain servers >> authoritative servers
  - Top-level domains include `.org`, `.com`, etc.
  - Authortative servers contain direct hostname-IP mappings
- DNS queries are directed to local DNS servers (usually set up by ISP) which serve as a proxy for walking the DNS hierarchy
- DDoS bandwidth-flooding attack: overwhelming DNS servers with packets to prevent legitimate queries from being serviced

## Transport Protocols

The Transport Layer enables process-to-process communication, and port numbers differentiate between different processes' sockets

- Demultiplexing: delivering ingress segments to the correct socket/process
- Multiplexing: gathering data from different sockets and serializing egress segments
- Source and destination port fields are 16 bits (range [0, 65535], but ports [0, 1023] are reserved)
- UDP sockets are a 2-tuple of `(dest IP, dest port)`, whereas TCP sockets are a 4-tuple of `(source IP, source port, dest IP, dest port)`

__UDP (User Datagram Protocol)__ only adds source and destination port fields and checksum to IP-layer datagrams

`| Source Port | Dest Port | Length | Checksum | Payload |`

__Reliable data transfer__ deals with packet corruption, loss, and reordering which occurs at lower layers

- `ACK` and `NAK` packets are sent from the receiver to signify whether the packet it received is corrupted or not
- Checksum: take the 1's complement (invert the bits) of the sum of all 16-bit words in the segment
- Why is `ACK`/`NAK` corruption problematic? The sender might not be able to differentiate between a corrupted `ACK` or `NAK` response
  - _Solution 1_: sender retransmits the current packet if it receives a corrupted response
  - However, now receiver cannot distinguish between a retransmitted packet and a packet containing new data
  - _Solution 2_: packets are numbered, and the sequence number is included in the header
- How to handle lost/delayed packets? Sender can simply time out and retransmit after waiting too long for an `ACK`
- Pipelining: to keep RDT performant, sender sends many packets at a time without waiting for `ACK`s
- Reordering: old packets may arrive much later, leading to confusion between different packets with the same sequence number
  - _Solution_: limiting packet lifetime allows sender to assume that old packets with a reused sequence number no longer exist in the network

__Go-Back-N (GBN)__: only N unacknowledged packets are allowed in the pipeline at any given time (sliding window)

- Receipt of an `ACK` for packet number $$n$$ signifies all packets up to and including $$n$$ have been correctly received
- Once timeout for oldest unacknowledged packet expires, sender retransmits all currently unacknowledged packets (at most $$N$$ packets are retransmitted, hence the name)
- Order of packet delivery matters: receiver only `ACK`s an uncorrupted packet $$n$$ when all packets up to $$n-1$$ have been correctly received
- In all other cases (out-of-order, corruption), the receiver discards the packet and resends an `ACK` for the last correctly received packet

__Selective-Repeat (SR)__ attempts to optimize GBN by retransmitting individual packets

- On the sending side, $$N$$ timers are needed (as there may be at most $$N$$ unacknowledged packets at any time)
- Receiver will acknowledge uncorrupted packets that arrive out-of-sequence, buffering up to $$N-1$$ such packets
- Receiver still has to acknowledge uncorrupted packets in $$[\texttt{rcv\_base} - N, \texttt{rcv\_base} - 1]$$, since sender and receiver windows may differ by at most $$N$$

__TCP (Transmission Control Protocol)__ shares many ideas with GBN, but with a few optimizations from SR

- Maximum segment size (MSS) refers to maximum data payload in a segment (not including headers)
  - Usually determined by maximum transmission unit (MTU), or the largest frame that can be transmitted over a link
- Segment sequence number is the bytestream number of the first byte in the segment payload
- Segment acknowledgement number is the bytestream number of the next byte that is expected
- TCP only acknowledges bytes up to the first missing byte in the stream
  - e.g. if segments A, B, C are sent in order, and only A and C are received, two acknowledgements containing the sequence number of B are sent back
- TCP RFC does not specify how to handle out-of-order segments, typically more efficient to buffer these
- Initial sequence numbers are usually randomly chosen on both ends of the connection to avoid collision with older sessions using the same port numbers
- TCP only maintains one timer for the oldest unacknowledged segment and will only retransmit this packet on timer expiry
- Fast retransmit: if the sender receives 3 duplicate `ACK`s for the same segment, it will retransmit that segment before the timer expires

__Flow control__ matches the rates at which sender transmits data and receiver consumes data from receive buffer to avoid buffer overflow
- Receiver keeps track of last byte consumed $$B_c$$ and last byte received $$B_r$$, so amount of space occupied in receive buffer is $$B_r - B_c$$
- Space left in buffer is $$\texttt{rwnd} \leftarrow \texttt{buf\_size} - (B_r - B_c)$$, included in window size field
- Sender keeps track of last byte sent $$B_s$$ and last `ACK`ed byte $$B_a$$, so $$B_s - B_a$$ bytes may still be transmitting to receiver
- Hence, sender must ensure $$B_s - B_a\leq \texttt{rwnd}$$
- Corner case: if $$\texttt{rwnd} = 0$$, sender is required to send tiny segments so receiver can `ACK` with updated receive window size and unblock sender

__TCP connection management__

- Three-way handshake (3 segments total)
  1. Initial request segment contains client's randomized initial sequence number `client_isn` and `SYN` flag set
  2. Server allocates local connection state, then responds to SYN with its own `server_isn`, acknowledgement `client_isn + 1`, and `SYN` flag set
  3. Client allocates local connection state, then responds to SYNACK with acknowledgement `server_isn + 1` and `SYN` flag cleared
- Closing connections (4 segments total)
  1. To start closing a connection, client sends a segment with the `FIN` flag set
  2. Server sends a segment acknowledging client's request to close connection, then sends its own segment with `FIG` set
  3. Client sends a segment acknowledging server's request to close connection, at which point all resources are deallocated
- If a server receives a SYN segment for a port that is not open for connections, it sends back a segment with the `RST` flag set
  - Needs to let the sender know not to resend the segment (as no SYNACK is coming)

__TCP congestion-control algorithm__

- To avoid congestion, sender limits transmission rate by ensuring $$B_s - B_a \leq \text{min}\{\texttt{rwnd}, \texttt{cwnd}\}$$
  - i.e. difference between last byte sent and lack byte `ACK`ed never exceeds the minimum of receive window and congestion window sizes
- Slow start:
  - Start with `cwnd = 1 MSS`, then increase by `1 MSS` for every acknowledgement of a segment
  - When `cwnd >= ssthresh` (congestion window exceeds slow start threshold), transition to congestion-avoidance state
  - Upon timeout, set `ssthresh = cwnd / 2` and reset `cwnd = 1 MSS`
  - Upon fast retransmit, transition to fast recovery state
- Congestion avoidance:
  - Upon receipt of acknowledgement, increase `cwnd` by `1 MSS / cwnd`
  - Upon timeout, set `ssthresh = cwnd / 2` and reset `cwnd = 1 MSS` (same as slow start)
  - Upon fast retransmit, set `ssthresh = cwnd / 2`, set `cwnd = cwnd / 2 + 3 MSS`, and transition to fast recovery state
- Fast recovery:
  - Upon receipt of duplicate acknowledgement for missing segment, increase `cwnd` by `1 MSS`
  - Upon receipt of acknowledgement indicating missing segment has been received, set `cwnd = sstresh`, and transition to congestion avoidance
  - Upon timeout, set `ssthresh = cwnd / 2`, reset `cwnd = 1 MSS`, and transition to slow start state
- Other network-assisted approaches:
  - Router could send a "choke" packet to a sender
  - Reserve a packet field to indicate network congestion

## Network Addressing

An __IP address__ is 4 bytes long, looks like `127.0.0.1` (each period-separated number is in the range [0, 255])

---

## References

- [Computer Networking: A Top-Down Approach](https://www.amazon.com/Computer-Networking-Top-Down-Approach-7th/dp/0133594149)
- [Javis in action: Fast Recovery Algorithm](https://www.isi.edu/websites/nsnam/DIRECTED_RESEARCH/DR_WANIDA/DR/JavisInActionFastRecoveryFrame.html)

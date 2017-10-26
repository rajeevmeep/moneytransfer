package com.etl.base;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;

import com.etl.util.MYSQLConnection;
import com.etl.util.MYSQLHelper;
import com.sun.mail.smtp.SMTPMessage;

import java.util.*;
import javax.mail.*;
import javax.mail.internet.*;
import com.sun.mail.smtp.SMTPMessage;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
public class CustomerDetail {

	
	public int CustomerId;
	public int CompanyId;
	public String AccountNumber;
	public String FirstName;
	public String LastName;
	
	public String Address1;
	public String Address2;
	public String City;
	
	public String State;
	public String ZipCode;
	public int CountryId;
	
	public String Phone;
	public String Email;
	public String Password;
	
	
	public String DOB;
	public String ProfileImage;
	public String ActivationCode;
	
	public boolean IsAccountActivated;
	public boolean IsActive;
	public boolean IsDeleted;
	
	public String CreatedDate;
	public String DeletedDate;
	
	public String Result;
	public String Error;
	
	private void setCustomerId(int CustomerId){
		this.CustomerId = CustomerId;
	}	
	private int getCustomerId(){
		return CustomerId;
	}
	
	private void setCompanyId(int CompanyId){
		this.CompanyId = CompanyId;
	}	
	private int getCompanyId(){
		return CompanyId;
	}
	
	private void setAccountNumber(String AccountNumber){
		this.AccountNumber = AccountNumber;
	}	
	private String getAccountNumber(){
		return AccountNumber;
	}
	
	private void setFirstName(String FirstName){
		this.FirstName = FirstName;
	}	
	private String getFirstName(){
		return FirstName;
	}
	
	private void setLastName(String LastName){
		this.LastName = LastName;
	}	
	private String getLastName(){
		return LastName;
	}
	
	private void setAddress1(String Address1){
		this.Address1 = Address1;
	}	
	private String getAddress1(){
		return Address1;
	}
	
	private void setAddress2(String Address2){
		this.Address2 = Address2;
	}	
	private String getAddress2(){
		return Address2;
	}
	
	private void setCity(String City){
		this.City = City;
	}	
	private String getCity(){
		return City;
	}
	
	private void setState(String State){
		this.State = State;
	}	
	private String getState(){
		return State;
	}
	
	private void setZipCode(String ZipCode){
		this.ZipCode = ZipCode;
	}	
	private String getZipCode(){
		return ZipCode;
	}
	
	private void setCountryId(int CountryId){
		this.CountryId = CountryId;
	}	
	private int getCountryId(){
		return CountryId;
	}
	private void setPhone(String Phone){
		this.Phone = Phone;
	}	
	private String getPhone(){
		return Phone;
	}
	
	private void setEmail(String Email){
		this.Email = Email;
	}	
	private String getEmail(){
		return Email;
	}
	
	private void setPassword(String Password){
		this.Password = Password;
	}	
	private void setDOB(String DOB){
		this.DOB = DOB;
	}	
	private String getDOB(){
		return DOB;
	}
	
	private void setProfileImage(String ProfileImage){
		this.ProfileImage = ProfileImage;
	}	
	private String getProfileImage(){
		return ProfileImage;
	}
	
	private void setActivationCode(String ActivationCode){
		this.ActivationCode = ActivationCode;
	}	
	private String getActivationCode(){
		return ActivationCode;
	}
	private void setIsAccountActivated(Boolean IsAccountActivated){
		this.IsAccountActivated = IsAccountActivated;
	}	
	private boolean getIsAccountActivated(){
		return IsAccountActivated;
	}
	
	private void setIsActive(Boolean IsActive){
		this.IsActive = IsActive;
	}	
	private boolean getIsActive(){
		return IsActive;
	}
	
	private void setIsDeleted(Boolean IsDeleted){
		this.IsDeleted = IsDeleted;
	}	
	private boolean getIsDeleted(){
		return IsDeleted;
	}
	
	
	
	private void setCreatedDate(String CreatedDate){
		this.CreatedDate = CreatedDate;
	}	
	private String getCreatedDate(){
		return CreatedDate;
	}
	
	
	private void setDeletedDate(String DeletedDate){
		this.DeletedDate = DeletedDate;
	}	
	private String getDeletedDate(){
		return DeletedDate;
	}
	private void setResult(String Result){
		this.Result = Result;
	}	
	private String getResult(){
		return Result;
	}
	private void setError(String Error){
		this.Error = Error;
	}	
	private String getError(){
		return Error;
	}
	
	
	public CustomerDetail addCustomer(CustomerDetail _CustomerDetail) {
		
		Connection _Connection = MYSQLConnection.GetConnection();
		 PreparedStatement _PreparedStatement = null;
		if(_CustomerDetail.CustomerId<=0)
		{
			try
			{
				if(_Connection!=null)
				{
					
					 String _hashPassword = byteArrayToHexString(UserDetail.computeHash(_CustomerDetail.Password));
					 MYSQLHelper _MYSQLHelper = new MYSQLHelper();
					
					 _CustomerDetail.setPassword(_hashPassword);
					
					
					ResultSet _ResultSetCustomerEmail = _MYSQLHelper.GetResultSet("SELECT Email FROM customer where Email='"+_CustomerDetail.Email+"'",_Connection);
					if (!_ResultSetCustomerEmail.next())
					{
						
					ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT email FROM company where Company_Id='"+_CustomerDetail.CompanyId+"'",_Connection);
					if (_ResultSet.next())
					{	
						ResultSet _ResultSetCountry = _MYSQLHelper.GetResultSet("SELECT country_id FROM country where country_id='"+_CustomerDetail.CountryId+"'",_Connection);
						if (_ResultSetCountry.next())
						{	
							SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
							Calendar cal = Calendar.getInstance();
							String date=format.format(cal.getTime());
							_CustomerDetail.setCreatedDate(date);
							
							String sInsertStatement = "INSERT INTO customer( Company_Id, AccountNumber, FirstName, LastName, Address1, Address2, City, State, ZipCode, country_id, Phone, Email, Password, DOB, ProfileImage, ActivationCode, IsAccountActivated,CreatedDate, IsActive)";
							 sInsertStatement = sInsertStatement + " VALUES(?, ?, ?, ?, ?,?,?,?,?,?,?, ?, ?, ?, ?, ?,?,?,?)";
								_PreparedStatement = _Connection.prepareStatement(sInsertStatement);
								_PreparedStatement.setInt(1, _CustomerDetail.CompanyId);							
								_PreparedStatement.setString(2, _CustomerDetail.AccountNumber);		
								_PreparedStatement.setString(3, _CustomerDetail.FirstName);
								_PreparedStatement.setString(4, _CustomerDetail.LastName);	
								_PreparedStatement.setString(5, _CustomerDetail.Address1);
								_PreparedStatement.setString(6, _CustomerDetail.Address2);
								_PreparedStatement.setString(7, _CustomerDetail.City);
								_PreparedStatement.setString(8, _CustomerDetail.State);
								_PreparedStatement.setString(9, _CustomerDetail.ZipCode);
								_PreparedStatement.setInt(10, _CustomerDetail.CountryId);
								_PreparedStatement.setString(11, _CustomerDetail.Phone);
								_PreparedStatement.setString(12, _CustomerDetail.Email);
								_PreparedStatement.setString(13, _CustomerDetail.Password);
								_PreparedStatement.setString(14, _CustomerDetail.DOB);
								_PreparedStatement.setString(15, _CustomerDetail.ProfileImage);
								_PreparedStatement.setString(16, _CustomerDetail.ActivationCode);
								_PreparedStatement.setBoolean(17, _CustomerDetail.IsAccountActivated);
								_PreparedStatement.setString(18, _CustomerDetail.CreatedDate);
								_PreparedStatement.setBoolean(19, _CustomerDetail.IsActive);
								_PreparedStatement.executeUpdate();	
								_CustomerDetail.setResult("Sucess");
								ResultSet _ResultSetld = _MYSQLHelper.GetResultSet("SELECT MAX(customer_Id) AS customer_Id FROM customer",_Connection);
								if (_ResultSetld.next()){
								int lastid = _ResultSetld.getInt("customer_Id");								
								_CustomerDetail.setCustomerId(lastid);}
								
								clear(_CustomerDetail);
						}
						else{
							_CustomerDetail.setResult("Failed");
							_CustomerDetail.setError("Invalid Country-Id!");
							clear(_CustomerDetail);
						}
						
					}
					else
					{
						_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Invalid Company-Id!");
					clear(_CustomerDetail);
						
					}
				}
					else
					{
						_CustomerDetail.setResult("Failed");
						_CustomerDetail.setError("Customer already exist!");
						clear(_CustomerDetail);
					}	
					
					
				}
				else
				{
					_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Error in api backend connectivity !");
					clear(_CustomerDetail);
				}
				
			}
			catch (Exception e) {
				clear(_CustomerDetail);
			}
			finally {
				if (_Connection != null) {
					try {
						_Connection.close();					
					} catch (SQLException ex) {
						//_CustomerDetail.setResult(ex.getMessage() + " Stack Trace: " + ex.getStackTrace());
						clear(_CustomerDetail);
					}
				}
			}
		}
		else{
			
			try
			{
				if(_Connection!=null)
				{
					
						MYSQLHelper _MYSQLHelper = new MYSQLHelper();
						
						
						ResultSet _ResultSetCustomer = _MYSQLHelper.GetResultSet("SELECT customer_Id FROM customer where customer_Id='"+_CustomerDetail.CustomerId+"'",_Connection);
						if (_ResultSetCustomer.next())
						{
							
						
						ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT email FROM company where Company_Id='"+_CustomerDetail.CompanyId+"'",_Connection);
						if (_ResultSet.next())
						{	
							ResultSet _ResultSetCountry = _MYSQLHelper.GetResultSet("SELECT country_id FROM country where country_id='"+_CustomerDetail.CountryId+"'",_Connection);
							if (_ResultSetCountry.next())
							{	
								SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								Calendar cal = Calendar.getInstance();
								String date=format.format(cal.getTime());
								_CustomerDetail.setCreatedDate(date);
								
								
								
								String strpassword=_CustomerDetail.Password;
								if(strpassword != "" | strpassword.length() != 0)
								{
									String _hashPassword = byteArrayToHexString(CompanyDetail.computeHash(_CustomerDetail.Password));
								
									_CustomerDetail.setPassword(_hashPassword);  
									String sInsertStatement ="UPDATE customer SET Password = ? WHERE customer_Id = ?";
									_PreparedStatement = _Connection.prepareStatement(sInsertStatement);
									_PreparedStatement.setString(1, _CustomerDetail.Password);
									_PreparedStatement.setInt(2, _CustomerDetail.CustomerId);
									_PreparedStatement.executeUpdate();
									_CustomerDetail.setPassword("xxxxxxxxxxxxxxxxxxxxxx"); 	
								}
								
								String sInsertStatement ="UPDATE customer SET 	Company_Id = ?,AccountNumber = ? ,FirstName = ? ,LastName = ? ,Address1 = ? "
										+ ",Address2 = ?,City = ?,State = ? ,ZipCode = ? ,country_id = ? ,Phone = ? ,Email = ? "
										+ ",DOB = ?,ProfileImage = ?,ActivationCode = ?,IsAccountActivated = ?,IsActive = ?,CreatedDate = ?"+ " WHERE customer_Id = ?";
								_PreparedStatement = _Connection.prepareStatement(sInsertStatement);
								_PreparedStatement.setInt(1, _CustomerDetail.CompanyId);							
								_PreparedStatement.setString(2, _CustomerDetail.AccountNumber);		
								_PreparedStatement.setString(3, _CustomerDetail.FirstName);
								_PreparedStatement.setString(4, _CustomerDetail.LastName);	
								_PreparedStatement.setString(5, _CustomerDetail.Address1);
								_PreparedStatement.setString(6, _CustomerDetail.Address2);
								_PreparedStatement.setString(7, _CustomerDetail.City);
								_PreparedStatement.setString(8, _CustomerDetail.State);
								_PreparedStatement.setString(9, _CustomerDetail.ZipCode);
								_PreparedStatement.setInt(10, _CustomerDetail.CountryId);
								_PreparedStatement.setString(11, _CustomerDetail.Phone);
								_PreparedStatement.setString(12, _CustomerDetail.Email);						
								_PreparedStatement.setString(13, _CustomerDetail.DOB);
								_PreparedStatement.setString(14, _CustomerDetail.ProfileImage);
								_PreparedStatement.setString(15, _CustomerDetail.ActivationCode);
								_PreparedStatement.setBoolean(16, _CustomerDetail.IsAccountActivated);
								
								_PreparedStatement.setBoolean(17, _CustomerDetail.IsActive);
								_PreparedStatement.setString(18, _CustomerDetail.CreatedDate);
								_PreparedStatement.setInt(19, _CustomerDetail.CustomerId);
								_PreparedStatement.executeUpdate();
								_CustomerDetail.setResult("Sucess");
								clear(_CustomerDetail);
							}
							else
							{
								_CustomerDetail.setResult("Failed");
								_CustomerDetail.setError("Invalid Country Id!");
								clear(_CustomerDetail);
							}
							
						}
						else
						{
							_CustomerDetail.setResult("Failed");
							_CustomerDetail.setError("Invalid Company Id!");
							clear(_CustomerDetail);
						}
					}
						else
						{
							_CustomerDetail.setResult("Failed");
							_CustomerDetail.setError("Invalid Customer Id!");
							clear(_CustomerDetail);
						}
				}
				else
				{
					_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Error in api backend connectivity !");
					clear(_CustomerDetail);
				}
			  
			}
			catch (Exception e) {
				clear(_CustomerDetail);
			}
			finally {
				if (_Connection != null) {
					try {
						_Connection.close();					
					} catch (SQLException ex) {
						clear(_CustomerDetail);
					}
				}
			}
		}
		
		return _CustomerDetail;
	}
	
	
	
	
	public static ArrayList<CustomerDetail> getCustomerDetails(int CompanyId) {
		Connection _Connection = MYSQLConnection.GetConnection();
		
		ArrayList<CustomerDetail> _CustomerDetaillist = new ArrayList<CustomerDetail>();
		
		MYSQLHelper _MYSQLHelper = new MYSQLHelper();
		 try
			{
			 if(CompanyId==0)
			 
			 {
				 
				 ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT * FROM customer where IsDeleted=0 ",_Connection);
					//if(_ResultSet.next())			
					//{
						while  (_ResultSet.next())
						{
							
							CustomerDetail _CustomerDetail=new CustomerDetail();
							_CustomerDetail.setCustomerId(_ResultSet.getInt("customer_Id"));
							_CustomerDetail.setCompanyId(_ResultSet.getInt("Company_Id"));
							_CustomerDetail.setAccountNumber(_ResultSet.getString("AccountNumber"));
							_CustomerDetail.setFirstName(_ResultSet.getString("FirstName"));
							_CustomerDetail.setLastName(_ResultSet.getString("LastName"));
							_CustomerDetail.setAddress1(_ResultSet.getString("Address1"));
							_CustomerDetail.setAddress2(_ResultSet.getString("Address2"));
							_CustomerDetail.setCity(_ResultSet.getString("City"));
							_CustomerDetail.setState(_ResultSet.getString("State"));
							_CustomerDetail.setZipCode(_ResultSet.getString("ZipCode"));
							_CustomerDetail.setCountryId(_ResultSet.getInt("country_id"));
							
							
							_CustomerDetail.setPhone(_ResultSet.getString("Phone"));
							_CustomerDetail.setEmail(_ResultSet.getString("Email"));
							_CustomerDetail.setDOB(_ResultSet.getString("DOB"));
							_CustomerDetail.setProfileImage(_ResultSet.getString("ProfileImage"));
							_CustomerDetail.setActivationCode(_ResultSet.getString("ActivationCode"));
							_CustomerDetail.setIsAccountActivated(_ResultSet.getBoolean("IsAccountActivated"));
							_CustomerDetail.setIsActive(_ResultSet.getBoolean("IsActive"));
							_CustomerDetail.setIsDeleted(_ResultSet.getBoolean("IsDeleted"));
							_CustomerDetail.setCreatedDate(_ResultSet.getString("CreatedDate"));
							_CustomerDetail.setDeletedDate(_ResultSet.getString("DeletedDate"));
							_CustomerDetail.setResult("Success");
							_CustomerDetaillist.add(_CustomerDetail);
							
						}
						 _ResultSet.close();
					//} 
			 }
			 else
			 {
				ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT * FROM customer where Company_Id='"+CompanyId+"' and IsDeleted=0",_Connection);
				
					while  (_ResultSet.next())
					{
						
						CustomerDetail _CustomerDetail=new CustomerDetail();
						_CustomerDetail.setCustomerId(_ResultSet.getInt("customer_Id"));
						_CustomerDetail.setCompanyId(_ResultSet.getInt("Company_Id"));
						_CustomerDetail.setAccountNumber(_ResultSet.getString("AccountNumber"));
						_CustomerDetail.setFirstName(_ResultSet.getString("FirstName"));
						_CustomerDetail.setLastName(_ResultSet.getString("LastName"));
						_CustomerDetail.setAddress1(_ResultSet.getString("Address1"));
						_CustomerDetail.setAddress2(_ResultSet.getString("Address2"));
						_CustomerDetail.setCity(_ResultSet.getString("City"));
						_CustomerDetail.setState(_ResultSet.getString("State"));
						_CustomerDetail.setZipCode(_ResultSet.getString("ZipCode"));
						_CustomerDetail.setCountryId(_ResultSet.getInt("country_id"));
						
						
						_CustomerDetail.setPhone(_ResultSet.getString("Phone"));
						_CustomerDetail.setEmail(_ResultSet.getString("Email"));
						_CustomerDetail.setDOB(_ResultSet.getString("DOB"));
						_CustomerDetail.setProfileImage(_ResultSet.getString("ProfileImage"));
						_CustomerDetail.setActivationCode(_ResultSet.getString("ActivationCode"));
						_CustomerDetail.setIsAccountActivated(_ResultSet.getBoolean("IsAccountActivated"));
						_CustomerDetail.setIsActive(_ResultSet.getBoolean("IsActive"));
						_CustomerDetail.setIsDeleted(_ResultSet.getBoolean("IsDeleted"));
						_CustomerDetail.setCreatedDate(_ResultSet.getString("CreatedDate"));
						_CustomerDetail.setDeletedDate(_ResultSet.getString("DeletedDate"));
						_CustomerDetail.setResult("Success");
						_CustomerDetaillist.add(_CustomerDetail);
						
					}
					 _ResultSet.close();
				
			 }
				
		
				
				
			}
		 catch(Exception e){
			 e.printStackTrace();
		 }
		 finally {
			
				if (_Connection != null) {
					try {
						_Connection.close();
					} catch (SQLException e) {
						//logger.error(e.getMessage() + " Stack Trace: " + e.getStackTrace());
					}
				}
			}	
		
		return _CustomerDetaillist;
	}
	
	
	
	
public CustomerDetail getCustomerDetail(CustomerDetail _CustomerDetail) {
		
		
		Connection _Connection = MYSQLConnection.GetConnection();
		
		 try
			{
				
				if(_Connection!=null)
				{
					
					MYSQLHelper _MYSQLHelper = new MYSQLHelper();
					ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT * FROM customer where customer_Id='"+_CustomerDetail.CustomerId+"'",_Connection);
					if (_ResultSet.next())
					{
						
						
						_CustomerDetail.setCustomerId(_ResultSet.getInt("customer_Id"));
						_CustomerDetail.setCompanyId(_ResultSet.getInt("Company_Id"));
						_CustomerDetail.setAccountNumber(_ResultSet.getString("AccountNumber"));
						_CustomerDetail.setFirstName(_ResultSet.getString("FirstName"));
						_CustomerDetail.setLastName(_ResultSet.getString("LastName"));
						_CustomerDetail.setAddress1(_ResultSet.getString("Address1"));
						_CustomerDetail.setAddress2(_ResultSet.getString("Address2"));
						_CustomerDetail.setCity(_ResultSet.getString("City"));
						_CustomerDetail.setState(_ResultSet.getString("State"));
						_CustomerDetail.setZipCode(_ResultSet.getString("ZipCode"));
						_CustomerDetail.setCountryId(_ResultSet.getInt("country_id"));						
						
						_CustomerDetail.setPhone(_ResultSet.getString("Phone"));
						_CustomerDetail.setEmail(_ResultSet.getString("Email"));
						_CustomerDetail.setDOB(_ResultSet.getString("DOB"));
						_CustomerDetail.setProfileImage(_ResultSet.getString("ProfileImage"));
						_CustomerDetail.setActivationCode(_ResultSet.getString("ActivationCode"));
						_CustomerDetail.setIsAccountActivated(_ResultSet.getBoolean("IsAccountActivated"));
						_CustomerDetail.setIsActive(_ResultSet.getBoolean("IsActive"));
						_CustomerDetail.setIsDeleted(_ResultSet.getBoolean("IsDeleted"));
						_CustomerDetail.setCreatedDate(_ResultSet.getString("CreatedDate"));
						_CustomerDetail.setDeletedDate(_ResultSet.getString("DeletedDate"));
						_CustomerDetail.setResult("Sucess");
						
					}
					else{
						_CustomerDetail.setResult("Failed");
						_CustomerDetail.setError("Invalid Customer Id!");
						clear(_CustomerDetail);
			    	}
					
				}
				else{
					_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Error in api backend connectivity !");
					clear(_CustomerDetail);
		    	}
			}
		 catch(Exception e)
		 {
			 clear(_CustomerDetail);
		 }
			finally {
				if (_Connection != null) {
					try {
						_Connection.close();
					} catch (SQLException e) {
						clear(_CustomerDetail);
					}
				}
			}	
		 return _CustomerDetail; 
	  }
	
	
	
public CustomerDetail loginCustomer(CustomerDetail _CustomerDetail)
{
	Connection _Connection = MYSQLConnection.GetConnection();	
	try
	{
		if(_Connection!=null)
		{
			String _hashPassword = byteArrayToHexString(CompanyDetail.computeHash(_CustomerDetail.Password));			
			MYSQLHelper _MYSQLHelper = new MYSQLHelper();
			_CustomerDetail.setPassword(_hashPassword);			
			ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT * FROM customer where Email='"+_CustomerDetail.Email+"' and Password ='"+_CustomerDetail.Password+"'",_Connection);
				if (_ResultSet.next())
				{
					_CustomerDetail.setCustomerId(_ResultSet.getInt("customer_Id"));
					_CustomerDetail.setCompanyId(_ResultSet.getInt("Company_Id"));
					_CustomerDetail.setAccountNumber(_ResultSet.getString("AccountNumber"));
					_CustomerDetail.setFirstName(_ResultSet.getString("FirstName"));
					_CustomerDetail.setLastName(_ResultSet.getString("LastName"));
					_CustomerDetail.setAddress1(_ResultSet.getString("Address1"));
					_CustomerDetail.setAddress2(_ResultSet.getString("Address2"));
					_CustomerDetail.setCity(_ResultSet.getString("City"));
					_CustomerDetail.setState(_ResultSet.getString("State"));
					_CustomerDetail.setZipCode(_ResultSet.getString("ZipCode"));
					_CustomerDetail.setCountryId(_ResultSet.getInt("country_id"));						
					
					_CustomerDetail.setPhone(_ResultSet.getString("Phone"));
					_CustomerDetail.setEmail(_ResultSet.getString("Email"));
					_CustomerDetail.setDOB(_ResultSet.getString("DOB"));
					_CustomerDetail.setProfileImage(_ResultSet.getString("ProfileImage"));
					_CustomerDetail.setActivationCode(_ResultSet.getString("ActivationCode"));
					_CustomerDetail.setIsAccountActivated(_ResultSet.getBoolean("IsAccountActivated"));
					_CustomerDetail.setIsActive(_ResultSet.getBoolean("IsActive"));
					_CustomerDetail.setIsDeleted(_ResultSet.getBoolean("IsDeleted"));
					_CustomerDetail.setCreatedDate(_ResultSet.getString("CreatedDate"));
					_CustomerDetail.setDeletedDate(_ResultSet.getString("DeletedDate"));
					_CustomerDetail.setResult("Sucess");
					_CustomerDetail.setPassword("xxxxxxxxxxxxxxxxxxxxxx");
				}
				else
				{
					_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Invalid Credentials!");
					clear(_CustomerDetail);
				}
		}
		else
		{
			_CustomerDetail.setResult("Failed");
			_CustomerDetail.setError("Error in api backend connectivity !");
			clear(_CustomerDetail);
		}
		
	}
	catch (Exception e) {
		
	}
	finally {
		if (_Connection != null) {
			try {
				_Connection.close();
				
			} catch (SQLException e) {
				//logger.error(e.getMessage() + " Stack Trace: " + e.getStackTrace());
			}
		}
	}
	return _CustomerDetail;
}	
	
	
public CustomerDetail deleteCustomer(CustomerDetail _CustomerDetail)
{
	Connection _Connection = MYSQLConnection.GetConnection();
	
	try
	{
		if(_Connection!=null)
		{
			PreparedStatement _PreparedStatement = null;
			MYSQLHelper _MYSQLHelper = new MYSQLHelper();
			ResultSet _ResultSet = _MYSQLHelper.GetResultSet("SELECT customer_Id FROM customer where customer_Id='"+_CustomerDetail.CustomerId+"'",_Connection);
				if (_ResultSet.next())
				{
					SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					Calendar cal = Calendar.getInstance();
					String date=format.format(cal.getTime());
					_CustomerDetail.setDeletedDate(date);
					_CustomerDetail.setIsDeleted(true);
					String sInsertStatement ="UPDATE customer SET 	IsDeleted = ? "+ ",DeletedDate = ? "+ " WHERE customer_Id = ?";
					_PreparedStatement = _Connection.prepareStatement(sInsertStatement);
					_PreparedStatement.setBoolean(1, _CustomerDetail.IsDeleted);
					_PreparedStatement.setString(2,_CustomerDetail.DeletedDate);
					_PreparedStatement.setInt(3, _CustomerDetail.CustomerId);	
					_PreparedStatement.executeUpdate();
					_CustomerDetail.setResult("Sucess");
					_CustomerDetail.setPassword("xxxxxxxxxxxxxxx");
				}
				else{
					_CustomerDetail.setResult("Failed");
					_CustomerDetail.setError("Invalid User Id!");
					//logger.error(_auth.errorstatus);
		    	}
		}
		else{
			_CustomerDetail.setResult("Failed");
			_CustomerDetail.setError("Error in api backend connectivity !");
			//logger.error(_auth.errorstatus);
    	}
	}
	catch (Exception e) {
		
		_CustomerDetail.setResult(e.getMessage() + " Stack Trace: " + e.getStackTrace());
	}
	finally {
		if (_Connection != null) {
			try {
				_Connection.close();
				clear(_CustomerDetail);
			} catch (SQLException e) {
				//logger.error(e.getMessage() + " Stack Trace: " + e.getStackTrace());
			}
		}
	}
	return _CustomerDetail;
}





	 public static byte[] computeHash(String x)
			  throws Exception
			  {
			     java.security.MessageDigest d =null;
			     d = java.security.MessageDigest.getInstance("SHA-1");
			     d.reset();
			     d.update(x.getBytes());
			     return  d.digest();
			  }

			  public static String byteArrayToHexString(byte[] b){
			     StringBuffer sb = new StringBuffer(b.length * 2);
			     for (int i = 0; i < b.length; i++){
			       int v = b[i] & 0xff;
			       if (v < 16) {
			         sb.append('0');
			       }
			       sb.append(Integer.toHexString(v));
			     }
			     return sb.toString().toUpperCase();
			  }
			  
			
			  public CustomerDetail email(CustomerDetail _CustomerDetail) {
				     String user = "user";   // Newly created user on JAMES Server
				        String password = "password"; // user password

				        String fromAddress = "user@example.com"; // newlycreateduser@localhost
				        String toAddress = "myaccount@gmail.com";


				        // Create a mail session
				        Properties properties = new Properties();
				        properties.put("mail.transport.protocol", "smtp");
				        properties.put("mail.smtp.host", "example.com");
				        properties.put("mail.smtp.port", "25");
				        properties.put("mail.smtp.username", user);
				        properties.put("mail.smtp.password", password);
				        Session session = Session.getDefaultInstance(properties, null);

				        try 
				        {
				            Message message = new MimeMessage(session);
				            message.setFrom(new InternetAddress(fromAddress));
				            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(toAddress));

				            message.setSubject("Email From my Own Server");
				            message.setText("Test Mail sent from My Apache James Server!!");
				            Transport.send(message);

				            System.out.println("Email sent successfully");
				        }
				        catch (MessagingException e) 
				        {
				            e.printStackTrace();
				        }
			  return _CustomerDetail;
			}
			  
			  
			  
			  public CustomerDetail clear(CustomerDetail _CustomerDetail)
			  {
				  _CustomerDetail.setAccountNumber("");
				  _CustomerDetail.setFirstName("");
				  _CustomerDetail.setLastName("");
				  _CustomerDetail.setAddress1("");
				  _CustomerDetail.setAddress2("");
				  _CustomerDetail.setCity("");
				  _CustomerDetail.setState("");
				  _CustomerDetail.setZipCode("");
				  _CustomerDetail.setPhone("");
				  _CustomerDetail.setEmail("");
				  _CustomerDetail.setPassword("");
				  _CustomerDetail.setDOB("");
				  _CustomerDetail.setProfileImage("");
				  _CustomerDetail.setActivationCode("");				 
				  _CustomerDetail.setCreatedDate("");
				  _CustomerDetail.setCountryId(0);
				  _CustomerDetail.setCompanyId(0);
			   return _CustomerDetail;
			  }
			  
}
